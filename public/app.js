$(function(){
'use strict';

addIndexListeners();

function addIndexListeners(){
    $('#sign-in').on('click', function(e){
        e.preventDefault();
        // console.log('SIGN IN CLICKED');
        $('#welcome').fadeOut();
        $('#users').fadeIn();
    });
    $('#sign-up').on('click', function(e){
        e.preventDefault();
        // console.log('SIGN UP CLICKED');
        $('#welcome').fadeOut();
        $('#registration').fadeIn();
        addRegisterListener();
    });
}

//USERS
function addRegisterListener(){
    $('#ladderReg').submit(function(e){
        e.preventDefault();
        const firstName = $('input[id=first]').val();
        const lastName = $('input[id=last]').val();
        const userName = $('input[id=username]').val();
        const password = $('input[id=pwd]').val();
        // const userObj = {
        //     "name": {"firstName": `${firstName}`,
        //             "lastName": `${lastName}`
        //     },
        //     "username": `${userName}`,
        //     "password": `${password}`
        // };
        const userObj = {
            "firstName": `${firstName}`,
            "lastName": `${lastName}`,
            "username": `${userName}`,
            "password": `${password}`
        };
        postNewUser(userObj);
        console.log(userObj);
    });
    
}

function postNewUser(userObj){
    $.ajax({
        url: `http://localhost:8080/users`,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(userObj),
        processData: false
    })
    .done(function(data){
        getUsers();
        $('#registration').fadeOut();
        $('#users').fadeIn();
        // console.log(data);
    })
    .fail(function(err){
        console.log(err);
    })
}

function getUsers(){
    $.ajax({
        url: 'http://localhost:8080/users',
        method: "GET",
        dataType: 'json'
    })
    .done(function(data){
        // console.log(data);
        showUsers(data.users);
    })
    .fail(function(err){
        console.log(err);
    })
}

function showUsers(usersData){
    usersData.forEach(function(user){
        const playerName = `${user.name}`;
        const playerID = `${user.id}`;
        const playerDiv =createPlayerHTML(playerName, playerID);
        $('#players').append(playerDiv);
    });
    addUserEditListener();
}

function createPlayerHTML(name, id){
    return `<div class="player-show" data-attr=${id}>${name}
            <button type="button" class="user-edit">Edit</button>`
}

function addUserEditListener(){
    $('.user-edit').on("click", function(event){
        event.stopPropagation();
        const playerID = $(this).parent().attr('data-attr');
        console.log(`going to edit users/${playerID} `);
        //ajax call for specific user
        getPlayer(playerID);
    });
}

function getPlayer(ID){
    $.ajax({
        url: `http://localhost:8080/users/${ID}`,
        method: 'GET',
        dataType: 'json'
    })
    .done(function(data){
        // console.log(data);
        //render player PUT Form
        createUserEdit(data);
    })
    .fail(function(err){
        console.log(err)
    })
}

function createUserEdit(user){
    console.log(`${user.name} ${user.username} ${user.gender} isActive:${user.isActive}`);
    const userForm = generateUserFormHTML(user.name, user.username, user.age, user.email);
    $('#users').fadeOut();
    $('#user-edit').append(userForm).fadeIn();
    addUserPutListener(user);
    addUserDeleteListener(user.id);
}

function addUserDeleteListener(ID){
    $('#user-delete').on('click', function(e){
        alert('Are you sure you want to delete this user?');
        userDelete(ID);
    });
}

function userDelete(ID){
    $.ajax({
        url: `http://localhost:8080/users/${ID}`,
        method: 'DELETE'
    })
    .done(function(data){
        getUsers();
        $('#user-edit').fadeOut();
        $('#users').fadeIn();
    })
    .fail(function(err){
        console.log(err)
    })
}

function addUserPutListener(user){
    $('#user-edit').submit(function(e){
        e.preventDefault();
        const userName = $('input[id=new-username]').val();
        const age = $('input[id=new-age]').val();
        const email = $('input[id=new-email]').val();
        console.log(`updating ${user.id} ${userName}  ${age}  ${email} `);
        const userObj = {
            "id": `${user.id}`,
            "username": `${userName}`,
            "email": `${email}`,
            "age": `${age}`
        }
        console.log(userObj);
        putUser(user.id, userObj);
    });
}

function putUser(ID, userObj){
    $.ajax({
        url: `http://localhost:8080/users/${ID}`,
        method: "PUT",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(userObj),
        processData: false
    })
    .done(function(data){
        console.log(data);
    })
    .fail(function(err){
        console.log(err);
    })
}

function generateUserFormHTML(name, username, age, email){
    return `<form id="user-edit">
    <h1>Edit Player Profile for ${name}<h1>
      <fieldset>
        <legend></legend>
        <label for="new-username"><b>Username</b></label>
        <input id="new-username" type="text" placeholder="${username}" name="new-username">
        
        <label for="new-email"><b>Email</b></label>
        <input id="new-email" type="text" placeholder="${email}" name="new-email">
    
        <label for="new-age"><b>Age</b></label>
        <input id="new-age" type="text" placeholder="${age}" name="age">
    
        <input type="submit" id="user-edit-btn" value="Submit">
      </fieldset>
    </div>
  </form> 
  <button type="button" id="user-delete">Delete this User</button>`;
}

//~~~~~~~~
//LADDERS 
function showLadder(ladderData){
    let rank;
    ladderData.forEach(function(place) {
        if(place.user){
            const playerName = `${place.user.name.firstName} ${place.user.name.lastName}`;
            const playerID = place.user._id;
            // console.log(place);
            rank = place.rank;
            const rungDiv = createRungHTML(rank, playerName, playerID);
            $('#ladder').append(rungDiv);
    }
    });
    addChallengeListener(rank);
}

function getLadder(ladderId){
    $.ajax({
        url: `http://localhost:8080/ladders/${ladderId}`,
        method: "GET",
        dataType: 'json'
    })
    .done(function(data){
        // console.log(data.rankings);
        showLadder(data.rankings);
    })
    .fail(function(err){
        console.log(err);
    })
}

function createRungHTML(rank, player, ID){
    return `<div id="${rank}" class="ladder-rung" data-attr="${ID}">${rank}:  ${player}
             <button type="button" class="challenge">Challenge</button>
    </div>`
}


//~~~~~~~
//MATCHES

function addChallengeListener(rank){
    $('.challenge').on("click", function(event){
        event.stopPropagation();
        const defender = $(this).parent().attr('data-attr');
        // console.log(`challenge to ${defender} will be created`);
        $(this).fadeOut();
        
        //create Match 
        //Pete Sampras as the default challenger until auth implemented
        const challenger = "5b9d6e9661b1448a7f9d5936";
        const matchObj = {"defender": defender, "challenger": challenger, "defenderRank": rank, "ladder": ladderID};
        const matchID = createMatch(matchObj);
        // console.log(matchID);
        
        $(this).parent().attr('data-attr', `${matchID}`);
        $(this).next('.record').fadeIn();
    });
}

function createMatch(matchObj){
    $.ajax({
        url: 'http://localhost:8080/matches',
        method: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(matchObj),
        processData: false,
        success: function(response){
            console.log(response.id);
            
        }
    })
    .done(function(){
        getMatches();
    })
    .fail(function(err){
    console.log(err);
    })
}

function addRecordListener(){
    $('.record').on('click', function(e){
        // e.stopPropagation();
        e.preventDefault();
        const matchID = $(this).parent().attr('data-attr');
        //need a get for specific matches
        getMatch(matchID);
    });
}

function addMatchDeleteListener(){
    $('.del-challenge').on('click', function(e){
        // event.stopPropagation();
        e.preventDefault();
        const matchID = $(this).parent().attr('data-attr');
        //need a get for specific matches
        deleteMatch(matchID);
    });
}

function getMatch(matchID){
    $.ajax({
        url: `http://localhost:8080/matches/${matchID}`,
        method: "GET",
        dataType: 'json'
    })
    .done(function(data){
    showScoreboard(data);
    })
    .fail(function(err){
        console.log(err);
    })
}

function deleteMatch(matchID){
    $.ajax({
        url: `http://localhost:8080/matches/${matchID}`,
        method: "DELETE",
        dataType: 'json'
    })
    .done(function(data){
    // showScoreboard(data);
    })
    .fail(function(err){
        console.log(err);
    })
}

function showScoreboard(match){
    $('#defender').text(`${match.defender.name.firstName} ${match.defender.name.lastName}`);
    $('#challenger').text(`${match.challenger.name.firstName} ${match.challenger.name.lastName}`);
    $('#scoreboard').fadeIn();
    addScoreListener(match);
}

function addScoreListener(match){
    $('#record-score').submit(event => {
        event.preventDefault();
        // event.stopPropagation();
        const defSet1 = $('input[id=def-set1]').val();
        const defSet2 = $('input[id=def-set2]').val();
        const defSet3 = $('input[id=def-set3]').val();
        const chalSet1 = $('input[id=chal-set1]').val();
        const chalSet2 = $('input[id=chal-set2').val();
        const chalSet3 = $('input[id=chal-set3').val();
        tallyScore(match, defSet1, defSet2, defSet3, chalSet1, chalSet2, chalSet3);
        $('#scoreboard').fadeOut();
    });
}

function tallyScore(match, def1, def2, def3, chal1, chal2, chal3){
    let rankingChange = false;
    let defSets = 0;
    let chalSets = 0;
    // let chalTB1 = chalTB2 =chalTB3 = defTB1 = defTB2 = defTB3 = 0;

    if(def1 > chal1) { defSets++;}
    else{ chalSets++;}
    if(def2 > chal2) { defSets++;}
    else{ chalSets++;}
    if(def3 > chal3) { defSets++;}
    else{ chalSets++;}
    const matchWinner = defSets > chalSets > 1? match.defender: match.challenger;
    let matchLoser, set1, set2, set3;
    if(matchWinner === match.defender){
        matchLoser = match.challenger;
        set1 = {
            setNum: 1,
            winnerGames: def1,
            loserGames: chal1
        };
        set2 = {
            setNum: 2,
            winnerGames: def2,
            loserGames: chal2
        }; 
        set3 = {
            setNum: 3,
            winnerGames: def3,
            loserGames: chal3
        };
    } else {
        rankingChange = true;
        matchLoser = match.defender;
        set1 = {
                setNum: 1,
                winnerGames: def1,
                loserGames: chal1
        };
        set2 = {
                setNum: 2,
                winnerGames: def2,
                loserGames: chal2
        }; 
        set3 = {
                setNum: 3,
                winnerGames: def3,
                loserGames: chal3
        };
    }
      const matchUpdateObj = {
        "id": match.id,
        "winner": matchWinner,
        "loser": matchLoser,
        "score": [set1, set2, set3],
        "dataPlayed": Date.now,
        "matchPlayed": true
        };

    console.log(matchUpdateObj);
    matchUpdate(match.id, matchUpdateObj);
    if(rankingChange){
        updateRankings(match.ladder, defender, challenger);

    }
}

//Update ladder rankings
function updateRankings(ladder, defender, challenger){
    //get current ladder rankings, manipulate and PUT back ladder changes.
}

    function matchUpdate(matchID, matchUpdateObj){
    $.ajax({
        url: `http://localhost:8080/matches/${matchID}`,
        method: "PUT",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(matchUpdateObj),
        processData: false
    })
    .done(function(data){
    showMatches(data.matches);
    })
    .fail(function(err){
        console.log(err);
    });
}

function showMatches(matchData){
    matchData.forEach(function(match){
        if(match.matchPlayed){
            const winnerName = `${match.winner.name.firstName} ${match.winner.name.lastName}`;
            const loserName = `${match.loser.name.firstName} ${match.loser.name.lastName}`;
            const firstSet = `${match.score[0].winnerGames}-${match.score[0].loserGames}`;
            const secondSet = `${match.score[1].winnerGames}-${match.score[1].loserGames}`;
            const thirdSet = `${match.score[2].winnerGames}-${match.score[2].loserGames}`;
            const matchDiv = generateMatchHTML(winnerName, loserName, firstSet, secondSet, thirdSet);
            $('#matches').append(matchDiv);
        } else  {  //unplayed challenge
            const defenderName = `${match.defender.name.firstName} ${match.defender.name.lastName}`;
            const challengerName = `${match.challenger.name.firstName} ${match.challenger.name.lastName}`;
            // const challengerName = "Pete Sampras";
            const matchID = match.id;
            const challengeDiv = generateChallengeHTML(defenderName, challengerName, matchID);
            $('#challenges').append(challengeDiv);
            addRecordListener();
            addMatchDeleteListener();
        }
    });
}

function generateChallengeHTML(defender, challenger, id){
    return `<div class="challenge" data-attr=${id}>${challenger} challenged ${defender}
            <button type="button" class="record">Record Score</button>
            <button type="button" class="del-challenge">Delete Challenge</button>
            </div>`;
}

function getMatches(){
    $.ajax({
        url: 'http://localhost:8080/matches',
        method: "GET",
        dataType: 'json'
    })
    .done(function(data){
    showMatches(data.matches);
    })
    .fail(function(err){
        console.log(err);
    });
}

function generateMatchHTML(winner, loser, first, second, third){
    return `<div class="match">${winner} d. ${loser}: ${first}, ${second}, ${third}</div>`;
}

const ladderID = "5b8b17c354c1e18445736711";

getLadder(ladderID);

// showMatches();
getMatches();
getUsers();


});