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
            // console.log(place);
            const rank = place.rank;
            const rungDiv = createRungHTML(rank, playerName);
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

function createRungHTML(rank, player){
    return `<div class="ladder-rung" data-attr="${player}">${rank}:  ${player}
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
        addRecordListener();
    });
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


function showMatches(){
    MOCK_MATCHES.matches.forEach(function(match){
        const winnerName = findPlayer(match.winner);
        const loserName = findPlayer(match.loser);
        const firstSet = `${match.score.set1.winnerGames}-${match.score.set1.loserGames}`;
        const secondSet = `${match.score.set2.winnerGames}-${match.score.set2.loserGames}`;
        const thirdSet = `${match.score.set3.winnerGames}-${match.score.set3.loserGames}`;
        const matchDiv = createMatchHTML(winnerName, loserName, firstSet, secondSet, thirdSet);
        $('#matches').append(matchDiv);
    })
}

function showMatchesToo(){
    $.ajax({
        url: 'http://localhost:8080/matches',
        method: "GET",
        dataType: 'json'
    })
    .done(function(data){
        // console.log(data);
    })
    .fail(function(err){
        console.log(err);
    })
}



function createMatchHTML(winner, loser, first, second, third){
    return `<div class="match">${winner} d. ${loser} ${first}, ${second}, ${third}</div>`;
}

const ladderID = '5b8b17c354c1e18445736711'
getLadder(ladderID);

// showMatches();
showMatchesToo();
getUsers();


});