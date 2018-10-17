$(function(){
'use strict';

const ladderID = "5baa4da2f5e65ab65bdf50fc"; //iMac
// const ladderID = "5bb6d11f58fe56fcc9356b28"; //MacBook
let ladderRankings= [];
let isActive = true;

const adminID = "5baa6d04ae44dfb8095dcafe";//iMac
// const adminID = "5bc5c73b837af33ac9bf8a5e"; //MacBook

checkToken();
getLadder(ladderID);
addEnterListener();
addNavLogin();
addNavReg();
addNavAdmin();
getLadder(ladderID);
addMyMatchesListener();
addMyProfileListener();
addIndexListeners();
addLadderViewListener();
addChallengeViewListener();
addMatchesListener();

function checkToken(){
    const token = sessionStorage.getItem('userToken');
    if(token){
        $('.nav-logout').css('visibility', 'visible');
        $('.nav-register, .nav-login').css('visibility', 'hidden');
        addNavLogout();
    }else {
        clearSessionStorage();
    }
}

//upon refresh user information from sessionStorage
function clearSessionStorage(){
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('currentUserID');
    sessionStorage.removeItem('currentUserRank');
}

function addEnterListener(){
    $('.enter-btn').on('click', function(e){
        console.log("Enter button clicked");
        $('#landing').fadeOut();
        $('#ladder').fadeIn();
    });
}

function addNavLogin(){
    $('.nav-login, #login-link').on('click', function(e){
        console.log('login link clicked');
        e.preventDefault();
        $('#ladder, #registration').fadeOut();
        $('#login').fadeIn();
        addLoginListener();
    });
}

function addNavReg(){
    $('.nav-register, #register-link').on('click', function(e){
        console.log('show register clicked');
        e.preventDefault();
        $('#ladder, #login').fadeOut();
        $('#registration').fadeIn();
        addRegisterListener();
    });
}

function addNavLogout(){
    $('.nav-logout').on('click', function(e){
        console.log('logout clicked');
        e.preventDefault();
        clearSessionStorage();
        getLadder(ladderID);
        $('#ladder, .admin-view').fadeOut();
        $('.nav-logout').css('visibility', 'hidden');
        $('.nav-register, .nav-login').css('visibility', 'visible');
        $('#ladder').fadeIn();
    });
}

function addNavAdmin(){
    $('.admin-view').on('click', function(e){
        console.log('admin view clicked');
        e.preventDefault();
        getUsers();
        $('#ladder, #played-matches, #challenges, #my-space, #registration, #login').fadeOut();
        $('#admin').fadeIn();
    });
}

addIndexListeners();
addLadderViewListener();
addChallengeViewListener();
addMatchesListener();

function addLadderViewListener(){
    $('.ladder-view').on('click', function(e){
        e.preventDefault();
        getLadder(ladderID);
        $('#played-matches, #admin, #my-space, #challenges').fadeOut();
        $('#ladder').fadeIn();
    });
}

function addChallengeViewListener(){
    $('.challenge-view').on('click', function(e){
        e.preventDefault();
        console.log('challenge view clicked');
        getMatches();
        $('#ladder, #played-matches, #my-space, #admin').fadeOut();
        $('#challenges').fadeIn();
    });
}

function addMatchesListener(){
    $('.match-view').on('click', function(e){
        console.log('matches view clicked');
        e.preventDefault();
        $('#ladder, #challenges, #my-space, #admin').fadeOut();
        getMatches();
        $('#played-matches').fadeIn();
    });
}


// function addLogoutListener(){
//     $('#logout-view').on('click', function(e){
//         console.log('logout-view clicked');
//         e.preventDefault();
//         sessionStorage.removeItem('userToken');
//         sessionStorage.removeItem('userName');
//         sessionStorage.removeItem('currentUserID');
//         sessionStorage.removeItem('currentUserRank');
//         sessionStorage.removeItem('currentName');
//         $('#logout-view').fadeOut();
//         $('#login-view').fadeIn();

//     })
// }

function addIndexListeners(){
    $('#login-view').on('click', function(e){
        e.preventDefault();
        $('#ladder, #played-matches, #challenges, #my-matches, #registration, #login-view').fadeOut();
        $('#login, #logut-view').fadeIn();
        addLoginListener();
    });
    $('#register-view').on('click', function(e){
        e.preventDefault();
        $('#ladder, #played-matches, #challenges, #admin, #my-matches, #login-view').fadeOut();
        $('#registration').fadeIn();
        addRegisterListener();
    });
}

function addLoginListener(){
    $('#login-form').on('submit', function(e){
        e.preventDefault();
        const userName = $('input[id=uname]').val();
        const password = $('input[id=passwd]').val();
        const authObj = {"username": userName, "password": password};
        $('#uname').val('');
        $('#passwd').val('');
        userAuth(authObj, userName);
        $('.nav-login, .nav-register').css('visibility', 'hidden');
        $('.nav-logout').css('visibility', 'visible');
        $('#ladder').fadeIn();
        addNavLogout();
        clearForm('#login-form');
    });
}

function clearForm(formName){
    $(`${formName}`).each(function(){
        this.reset();
    });
}

function userAuth(authObj, userName){
    $.ajax({
        url: `http://localhost:8080/auth/login`,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(authObj),
        processData: false
        })
        .done(function(data){
            $('#login').fadeOut();
            console.log(data);
            sessionStorage.setItem('userToken', `Bearer ${data.authToken}`);
            sessionStorage.setItem('userName', userName);
            //get users and find the current user's 
            getLadder(ladderID);
            //Get the ladder and create HTML
            //fadeIn the Ladder
            $('#login').fadeOut();
            $('#ladder').fadeIn();
            getUsers(userName);
        })
        .fail(function(err){
            console.log(err);
    })
}

//when a user is created they should be put at the bottom of the ladder
function addRegisterListener(){
    $('#ladderReg').submit(function(e){
        e.preventDefault();
        const firstName = $('input[id=first]').val();
        const lastName = $('input[id=last]').val();
        const userName = $('input[id=username]').val();
        const password = $('input[id=pwd]').val();
        const userObj = {
            "firstName": `${firstName}`,
            "lastName": `${lastName}`,
            "username": `${userName}`,
            "password": `${password}`
        };
        postNewUser(userObj);
        //show login form
        $('#registration').fadeOut();
        $('#login').fadeIn();
        clearForm('#ladderReg');
        
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
        // console.log(data);
        userAuth(data.username, tmpAuth);
        // const ladderObj = {"id": ladderID, "isActive": true, "new": data.id};
        // updateLadder(ladderObj);
    })
    .fail(function(err){
        console.log(err);
    })
}

function getUsers(userName){
    console.log('ran getUsers');
    $.ajax({
        url: 'http://localhost:8080/users',
        method: "GET",
        dataType: 'json',
        headers: {
            'Authorization': sessionStorage.getItem('userToken')
        }
    })
    .done(function(data){
        console.log(data);
        if(userName){
            setUserID(data.users);
        } else {
            showUsers(data.users);
        }
    })
    .fail(function(err){
        console.log(err);
    })
}

function setUserID(usersData){
    //find the ID of the username in sessionStorage
    const userName = sessionStorage.getItem('userName');
    const userArr = usersData.filter(user => {
        return user.username === userName;
    });
    const currentUser = userArr[0];
    console.log(currentUser.name);
    console.log(currentUser.isActive);
    isActive = currentUser.isActive;
    sessionStorage.setItem('currentUserID', currentUser.id);
    sessionStorage.setItem('currentName', currentUser.name);
    checkAdmin(currentUser.id);
    setCurrentUserRank(currentUser.id);
}

function checkAdmin(id){
    if(id === adminID){
        $('.admin-view').css("display", "block");
    }
}


function setCurrentUserRank(userID){
    getLadder(ladderID);
    const rankings = ladderRankings.map(player => player._id);
    const activePlayer = rankings.includes(userID);
    if(activePlayer){
        sessionStorage.setItem('currentUserRank', rankings.indexOf(userID));
    }else {
        sessionStorage.setItem('currentUserRank', rankings.length);
    }
}

function showUsers(usersData){
    $('#players-container').html('');
    usersData.forEach(function(user){
        const playerName = `${user.name}`;
        const playerID = `${user.id}`;
        const playerDiv =createPlayerHTML(playerName, playerID);
        $('#players-container').append(playerDiv);
    });
    addUserEditListener();
    addUserDeleteListener();
}

function createPlayerHTML(name, id){
    return `<div class="player-show" data-attr=${id}>${name}
            <button type="button" class="user-edit">Edit</button>
            <button type="button" class="user-delete">Delete</button>`;
}

function addUserEditListener(){
    $('.user-edit').on("click", function(event){
        event.stopPropagation();
        const playerID = $(this).parent().attr('data-attr');
        console.log(`going to edit users/${playerID} `);
        //ajax call for specific user
        getPlayer(playerID);
        $('#edit-user').fadeIn();
    });
}

function getPlayer(ID){
    $.ajax({
        url: `http://localhost:8080/users/${ID}`,
        method: 'GET',
        dataType: 'json'
    })
    .done(function(data){
        console.log(data);
        //render player PUT Form
        createUserEdit(data);
    })
    .fail(function(err){
        console.log(err)
    })
}

function createUserEdit(user){
    console.log(`${user.name} ${user.username} ${user.gender} isActive:${user.isActive}`);
    const tmpName = user.name.split(' ');
    const first = tmpName[0];
    const last = tmpName[1];
    const userForm = generateUserFormHTML(user.name, first, last,  user.username, user.age, user.email);
    // $('#users').fadeOut();
    $('#edit-user').append(userForm).fadeIn();
    addCancelListener();
    addUserPutListener(user);
}

function addCancelListener(){
    $('.edit-cancel').on('click', function(e){
        e.preventDefault();
        console.log('cancel clicked');
        //clear form
        clearForm('.userEditForm');
        $('#edit-user').fadeOut();
    })
}

function addUserDeleteListener(){
    $('.user-delete').on('click', function(e){
        e.preventDefault();
        const playerID = $(this).parent().attr('data-attr');
        console.log(`going to delete users/${playerID} `);
        userDelete(playerID);
    });
}

function userDelete(ID){
    $.ajax({
        url: `http://localhost:8080/users/${ID}`,
        method: 'DELETE',
        headers: {
            'Authorization': sessionStorage.getItem('userToken')
        }
    })
    .done(function(data){
        getUsers();
        $('#user-edit').fadeOut();
    })
    .fail(function(err){
        console.log(err)
    })
}

function addUserPutListener(user){
    $('.userEditForm').submit(function(e){
        console.log('addUserPutListener called');
        e.preventDefault();
        const firstName = $('input[id=new-first]').val();
        const lastName = $('input[id=new-last]').val();
        const userName = $('input[id=new-username]').val();
        const age = $('input[id=new-age]').val();
        const email = $('input[id=new-email]').val();
        console.log(`updating ${user.id} ${userName}  ${age}  ${email} `);
        const userObj = {
            "id": `${user.id}`,
            "name":{
                "firstName": `${firstName}`,
                "lastName": `${lastName}`
            },
            "username": `${userName}`,
            "email": `${email}`,
            "age": `${age}`
        }
        console.log(userObj);
        putUser(user.id, userObj);
        $('#edit-user').fadeOut();
        clearForm('.userEditForm');
    });
}

function putUser(ID, userObj){
    console.log('calling putUser');
    $.ajax({
        url: `http://localhost:8080/users/${ID}`,
        method: "PUT",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(userObj),
        headers: {
            'Authorization': sessionStorage.getItem('userToken')
        },
        processData: false
    })
    .done(function(data){
        console.log(data);
    })
    .fail(function(err){
        console.log(err);
    })
}

function generateUserFormHTML(name, firstname, lastname, username, age, email){
    return `<form class="userEditForm">
      <fieldset>
        <legend><h2>Edit Player Profile for ${name}<h2></legend>
        <label for="firstname"><strong>First Name</strong></label>
        <input id="new-first" type="text" name="firstname" value="${firstname}">

        <label for="lastname"><strong>Last Name</strong></label>
        <input id="new-last" type="text" value="${lastname}" name="lastname">

        <label for="new-username"><b>Username</b></label>
        <input id="new-username" type="text" value="${username}" name="new-username">
        
        <label for="new-email"><b>Email</b></label>
        <input id="new-email" type="email" value="${email}" name="new-email">
    
        <label for="new-age"><b>Age</b></label>
        <input id="new-age" type="text" value="${age}" name="age">
      </fieldset>
      <div class="btn-group"> 
        <button type="submit" class="edit-submit">Submit</button>
        <button type="button" class="edit-cancel">Cancel</button>
      </div>
    </div>
  </form> `;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//MATCHES
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
function addChallengeListener(rank){
    $('.chalBtn').on("click", function(event){
        event.stopPropagation();
        const defender = $(this).parent().attr('data-attr');
        // console.log(`challenge to ${defender} will be created`);
        $(this).fadeOut();
        $(this).next('.challenged').fadeIn();
        
        //create Match
        const challenger = sessionStorage.getItem('currentUserID');
        const matchObj = {"defender": defender, "challenger": challenger, "defenderRank": rank, "ladder": ladderID};
        const matchID = createMatch(matchObj);
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
        headers: {
            'Authorization': sessionStorage.getItem('userToken')
        },
        success: function(response){
            console.log(response.id);
            // getMatches();
            //Put match to each user
            addUsersMatch(response.id, matchObj);
        }
    })
    .done(function(){
        getMatches();
    })
    .fail(function(err){
    console.log(err);
    })
}

function addUsersMatch(matchID, matchObj){
    const defObj = {"id": matchObj.defender, "matches": matchID, "action": "add" };
    const chalObj = {"id": matchObj.challenger, "matches": matchID, "action": "add" };
    // console.log(defObj);
    // console.log(chalObj);
    putUser(matchObj.defender, defObj);
    putUser(matchObj.challenger, chalObj);
}

//WHERE IS SUPPOSED TO BE CALLED? *****************************************
function deleteUsersMatch(matchID, matchObj){
    const defObj = {"id": matchObj.defender, "matches": matchID, "action": "delete" };
    const chalObj = {"id": matchObj.challenger, "matches": matchID, "action": "delete"};
    // console.log(defObj);
    // console.log(chalObj);
    putUser(matchObj.defender, defObj);
    putUser(matchObj.challenger, chalObj);
}

function addMyMatchesListener(){
    $('.my-matches').on('click', function(e){
        console.log("My Matches clicked");
        e.preventDefault();
        getMatches();
        $('#ladder, #played-matches, #challenges, #admin').fadeOut();
        $('#my-space').fadeIn();
    })
}

function addMyProfileListener(){
    $('.my-profile').on('click', function(e){
        e.preventDefault();
        $('#ladder, #played-matches, #challenges, #admin, #my-space').fadeOut();
        $('#my-profile').fadeIn();
    });
}

//click registers for each
function addRecordListener(){
    $('.record').on('click', function(e){
        console.log('record match clicked');
        e.preventDefault();
        const matchID = $(this).parent().attr('data-attr');
        //need a get for specific matches
        getMatch(matchID);
        $('#scoreboard').fadeIn();
    });
}

//clicks register for each delete...why? how to stop
function addMatchDeleteListener(defiID, chalID){
    $('.del-challenge').on('click', function(e){
        console.log('delete match clicked');
        e.stopPropagation();
        e.preventDefault();
        const matchID = $(this).parent().attr('data-attr');
        //call to delete matchID for 2 competitors
        //updateObj will contain the matchID and both userIDs
        //need a get for specific matc
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

function showScoreboard(match){
    $('#defender').text(`${match.defender.name.firstName} ${match.defender.name.lastName}`);
    $('#challenger').text(`${match.challenger.name.firstName} ${match.challenger.name.lastName}`);
    $('#scoreboard').fadeIn();
    addScoreListener(match);
}

function addScoreListener(match){
    $('#record-score').submit(e => {
        e.preventDefault();
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
    console.log(`defSets = ${defSets} chalSets = ${chalSets}`);
    const matchWinner = defSets > chalSets ? match.defender: match.challenger;
    let matchLoser, set1, set2, set3;
    if(matchWinner === match.defender){
        console.log('defender won!');
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
        console.log('challenger won!');
        rankingChange = true;
        matchLoser = match.defender;
        set1 = {
                setNum: 1,
                winnerGames: chal1,
                loserGames: def1
        };
        set2 = {
                setNum: 2,
                winnerGames: chal2,
                loserGames: def2
        }; 
        set3 = {
                setNum: 3,
                winnerGames: chal3,
                loserGames: def3
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
        // what is defender's rank? 
        const rankings = ladderRankings.map(player => player._id);
        const defenderRank = rankings.indexOf(match.defender._id);
        console.log(match.defender._id);
        console.log(defenderRank);
        const ladderObj = {"id": ladderID, "defender": match.defender._id, "challenger": match.challenger._id, "isActive": true};
        //console.log(ladderObj);
        updateLadder(ladderObj);
        console.log(`changing ${sessionStorage.getItem('currentUserRank')} to ${defenderRank}`);
        sessionStorage.setItem('currentUserRank', defenderRank);
    } 
    if(!isActive){
        //set challenger isActive to true
        const userObj = {"id": match.challenger._id,"isActive": true};
        putUser(match.challenger._id, userObj)
        //put challenger on bottom rung
        const ladderObj = {"id": ladderID, "isActive": true, "new": match.challenger._id};
        updateLadder(ladderObj);
    }
}

    function matchUpdate(matchID, matchUpdateObj){
    $.ajax({
        url: `http://localhost:8080/matches/${matchID}`,
        method: "PUT",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(matchUpdateObj),
        headers: {
            'Authorization': sessionStorage.getItem('userToken')
        },
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
    //clear match div
    $('#match-container, #my-matches-container').html('');
    $('#match-container, #my-matches-container').append('<h3>Completed Matches:</h3>');
    $('#challenge-container, #my-challenges-container').html('');
    $('#challenge-container, #my-challenges-container').append('<h3>Current Challenges:</h3>');
    const user = sessionStorage.getItem('currentUserID');
    
    matchData.forEach(function(match){
        const myMatch = user === match.challenger._id || user === match.defender._id?true:false;
        if(match.matchPlayed){
            const winnerName = `${match.winner.name.firstName} ${match.winner.name.lastName}`;
            const loserName = `${match.loser.name.firstName} ${match.loser.name.lastName}`;
            const firstSet = `${match.score[0].winnerGames}-${match.score[0].loserGames}`;
            const secondSet = `${match.score[1].winnerGames}-${match.score[1].loserGames}`;
            const thirdSet = `${match.score[2].winnerGames}-${match.score[2].loserGames}`;
            const matchDiv = generateMatchHTML(winnerName, loserName, firstSet, secondSet, thirdSet);
            $('#match-container').append(matchDiv);
            //handle my-matches
            // console.log(match);
            // console.log(`user is ${user} chal/def are ${match.challenger._id} ${match.defender._id}`);
            if(myMatch){
                $('#my-matches-container').append(matchDiv);
            }
        } else  {  //unplayed challenge
            const defenderName = `${match.defender.name.firstName} ${match.defender.name.lastName}`;
            const challengerName = `${match.challenger.name.firstName} ${match.challenger.name.lastName}`;
            const matchID = match.id;
            const challengeDiv = generateChallengeHTML(myMatch, defenderName, challengerName, matchID);
            $('#challenge-container').append(challengeDiv);
            //handle my-matches
            if(myMatch){
                $('#my-challenges-container').append(challengeDiv);
            }
            addRecordListener();
            addMatchDeleteListener(match.defender._id, match.challenger._id);
        }
    });
}


function generateChallengeHTML(myMatch, defender, challenger, id){
    return `<div class="challenge" data-attr=${id}>${challenger} challenged ${defender}
            <button type="button" class="record" style=${!myMatch?"display:none":"display:inline"}>Record</button>
            <button type="button" class="del-challenge" style=${!myMatch?"display:none":"display:inline"}>Delete</button>
            </div>`;
}

function getMatches(){
    $.ajax({
        url: 'http://localhost:8080/matches',
        headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')},
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

//DELETE MATCH
function deleteMatch(matchID){
    $.ajax({
        url: `http://localhost:8080/matches/${matchID}`,
        method: "DELETE",
        dataType: 'json',
        headers: {
            'Authorization': sessionStorage.getItem('userToken')
        }
    })
    .done(function(data){
    // showScoreboard(data);
    })
    .fail(function(err){
        console.log(err);
    })
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//LADDERS 
function showLadder(ladderData){
    //clear ladder div
    $('#ladder-container').html('');
    $('#ladder-container').append('<h3>Current Standings for <span>Men&#39;s Open:</span>');
    let rank;
    // const finalRung  = ladderData.length + 1;
    ladderData.forEach(function(place, index) {
        if(place.name){
            const playerName = `${place.name.firstName} ${place.name.lastName}`;
            const playerID = place._id;
            //console.log(place.name.firstName);
            rank = index + 1;
            const rungDiv = createRungHTML(rank, playerName, playerID);
            $('#ladder-container').append(rungDiv);
        }
        //if player is new/inActive append as last rung with no ranking
    });
    if(!isActive){
        rank = ladderData.length + 1;
        const lastRung = createRungHTML(rank, sessionStorage.getItem('currentName'), sessionStorage.getItem('currentUserID'));
        $('#ladder-container').append(lastRung);
    }
    addChallengeListener(rank);
}

function getLadder(ladder){
    $.ajax({
        url: `http://localhost:8080/ladders/${ladder}`,
        method: "GET",
        dataType: 'json'
    })
    .done(function(data){ 
        ladderRankings = data.rankings;
        showLadder(ladderRankings);
    })
    .fail(function(err){
        console.log(err);
    })
}

function createRungHTML(rank, player, ID){
    let chalRank = sessionStorage.getItem('currentUserRank'); // Not updated 
        

    return `<div id="${rank}" class="ladder-rung" data-attr="${ID}"><span><font color=${ID==sessionStorage.getItem('currentUserID')?"yellow":"white"}>
        ${rank}:&nbsp;&nbsp; ${player}</font></span>
             <button type="button" class="chalBtn" ${rank > chalRank|| rank <= chalRank - 5?'hidden':''}>Challenge</button>
             <span class="challenged" hidden>Challenged</span>
    </div>`
}

//Update ladder rankings
//NOTE: If unranked challenger loses they should be set to active and go at the bottom of the ladder /////
function updateLadder(ladderUpdateObj){
    console.log(ladderUpdateObj);
    $.ajax({
        url: `http://localhost:8080/ladders/${ladderID}`,
        method: "PUT",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(ladderUpdateObj),
        headers: {
            'Authorization': sessionStorage.getItem('userToken')
        },
        processData: false
    })
    .done(function(data){
        getLadder(ladderID);
    })
    .fail(function(err){
        console.log(err); 
    })
}
});