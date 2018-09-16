$(function(){
'use strict';

addIndexListeners();

function addIndexListeners(){
    $('#sign-in').on('click', function(e){
        e.preventDefault();
        console.log('SIGN IN CLICKED');
        $('#welcome').fadeOut();
        $('#users').fadeIn();
    });
    $('#sign-up').on('click', function(e){
        e.preventDefault();
        console.log('SIGN UP CLICKED');
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
        const email = $('input[id=email]').val();
        const password = $('input[id=pwd]').val();
        const userObj = {
            "name": {"firstName": `${firstName}`,
                    "lastName": `${lastName}`
            },
            "username": `${userName}`,
            "email": `${email}`,
            "password": `${password}`
        };
        postNewUser(userObj);
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
        console.log(data);
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
    ladderData.forEach(function(place) {
        if(place.user){
            const playerName = `${place.user.name.firstName} ${place.user.name.lastName}`;
            const playerID = place.user._id;
            // console.log(place);
            const rank = place.rank;
            const rungDiv = createRungHTML(rank, playerName, playerID);
            $('#ladder').append(rungDiv);
    }
    });
    addChallengeListener();
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
    return `<div class="ladder-rung" data-attr="${ID}">${rank}:  ${player}
             <button type="button" class="challenge">Challenge</button>
             <button type="button" class="record" hidden >Record Score</button>
    </div>`
}


//~~~~~~~
//MATCHES

function addChallengeListener(){
    $('.challenge').on("click", function(event){
        event.stopPropagation();
        const defender = $(this).parent().attr('data-attr');
        console.log(`challenge to ${defender} will be created`);
        $(this).fadeOut();
        $(this).next('.record').fadeIn();
        //create Match 
        const challenger = "5b9e5486bd2fd176d74b35c3";
        const matchObj = {"defender": defender, "challenger": challenger, "ladder": ladderID};
        createMatch(matchObj);
        // console.log(matchObj);
        addRecordListener();
    });
}

function createMatch(matchObj){
    $.ajax({
        url: 'http://localhost:8080/matches',
        method: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(matchObj),
        // processData: false,
        success: function(response){
            console.log(response.content);
        }
    })
    .done(function(){
        // console.log(data);
        getMatches();
    })
    .fail(function(err){
    console.log(err);
    })
}


function addRecordListener(){
    $('.record').on('click', function(event){
        event.stopPropagation();
        const defender = $(this).parent().attr('data-attr');
        $('#defender').html(`${defender}:`);
        $('#challenger').html('Logged-in User:');
        $(this).fadeOut();
        $('#score').fadeIn();
        $(this).prev('.challenge').fadeIn();
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
        }
    });
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
    })
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