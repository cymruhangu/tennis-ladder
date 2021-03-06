$(function(){
'use strict';

// const ladderID = "5baa4da2f5e65ab65bdf50fc"; //iMac
const ladderID = "5bb6d11f58fe56fcc9356b28"; //MacBook
let ladderRankings= [];
let currentMatches=[];
let isActive = false;
let firstMatch = true;

// const adminID = "5baa6d04ae44dfb8095dcafe";//iMac
const adminID = "5bc5c73b837af33ac9bf8a5e"; //MacBook - Mlab
const BASE_URL = 'https://serene-shore-12858.herokuapp.com';
// const BASE_URL = 'http://localhost:8080'

checkToken();
getLadder(ladderID);
getMatches();
addEnterListener();
addNavLogin();
addNavReg();
addNavAdmin();
addMyMatchesListener();
addMyProfileListener();
addIndexListeners();
addLadderViewListener();
addChallengeViewListener();
addMatchesListener();
addHamburgerListener();
addCloseMenuListener();

function addHamburgerListener(){
    $('.fa-bars').on('click', function(e){
        // e.preventDefault();
        $(this).css('display', 'none');
        $('.fa-times').css('display', 'inline-block');
        $('.left-nav, .log-nav').css('display', 'block');

    })
}

function addCloseMenuListener(){
    $('.fa-times').on('click', function(e){
        e.preventDefault();
        $('.left-nav, .log-nav').css('display', 'none');
        $(this).css('display', 'none');
        $('.fa-bars').css('display', 'block');
    });
}
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
    sessionStorage.removeItem('currentName');
}

function addEnterListener(){
    $('.enter-btn').on('click', function(e){
        $('#landing').fadeOut();
        $('#ladder').fadeIn(90, function(){
            $('#ladder-container').fadeIn(2500)});
    });
}

function addNavLogin(){
    $('.nav-login, #login-link').on('click', function(e){
        e.preventDefault();
        $('#ladder, #registration').fadeOut();
        $('#login').fadeIn();
        addLoginListener();
    });
}

function addNavReg(){
    $('.nav-register, #register-link').on('click', function(e){
        e.preventDefault();
        $('#ladder, #login').fadeOut();
        $('#registration').fadeIn();
        addRegisterListener();
    });
}

function addNavLogout(){
    $('.nav-logout').on('click', function(e){
        e.preventDefault();
        clearSessionStorage();
        getLadder(ladderID);
        $('#ladder, .admin-view').fadeOut();
        $('.nav-logout').css('visibility', 'hidden');
        $('.nav-register, .nav-login').css('visibility', 'visible');
        $('#ladder').fadeIn(90, function(){
            $('#ladder-container').fadeIn(2200)});
    });
}

function addNavAdmin(){
    $('.admin-view').on('click', function(e){
        e.preventDefault();
        getUsers();
        $('#ladder,#ladder-container, #match-container, #played-matches, #challenges, #challenge-container, #my-space, #registration, #login').fadeOut();
        $('#admin').fadeIn();
    });
}

function addLadderViewListener(){
    $('.ladder-view').on('click', function(e){
        e.preventDefault();
        getLadder(ladderID);
        $('#played-matches, #match-container, #admin, #my-space, #challenges, #challenge-container').fadeOut();
        $('#ladder').fadeIn(90, function(){
            $('#ladder-container').fadeIn(2500)});
    });
}

function addChallengeViewListener(){
    $('.challenge-view').on('click', function(e){
        e.preventDefault();
        getMatches();
        $('#ladder, #ladder-container, #played-matches, #match-container, #my-space, #admin').fadeOut();
        $('#challenges').fadeIn(90, function(){
            $('#challenge-container').fadeIn(2000);
        });
    });
}

function addMatchesListener(){
    $('.match-view').on('click', function(e){
        e.preventDefault();
        $('#ladder, #ladder-container, #challenges, #my-space, #admin').fadeOut();
        getMatches();
        $('#played-matches').fadeIn(90, function(){
            $('#match-container').fadeIn(2200);
        });
    });
}

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
        url: `${BASE_URL}/auth/login`,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(authObj),
        processData: false
        })
        .done(function(data){
            $('#login').fadeOut();
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
        $('#ladder').fadeIn();
        clearForm('#ladderReg');
        
    });
}

function postNewUser(userObj){
    $.ajax({
        url: `${BASE_URL}/users`,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(userObj),
        processData: false
    })
    .done(function(data){
        getUsers();
        $('#registration').fadeOut();
        // userAuth(data.username, tmpAuth);
    })
    .fail(function(err){
        console.log(err);
    })
}

function getUsers(userName){
    $.ajax({
        url: `${BASE_URL}/users`,
        method: "GET",
        dataType: 'json',
        headers: {
            'Authorization': sessionStorage.getItem('userToken')
        }
    })
    .done(function(data){
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
        //ajax call for specific user
        getPlayer(playerID);
        $('#edit-user-admin').fadeIn();
    });
}

function getPlayer(ID){
    $.ajax({
        url: `${BASE_URL}/users/${ID}`,
        method: 'GET',
        dataType: 'json',
        headers: {
            'Authorization': sessionStorage.getItem('userToken')
        }
    })
    .done(function(data){
        //render player PUT Form
        createUserEdit(data);
    })
    .fail(function(err){
        console.log(err)
    })
}

function createUserEdit(user){
    const tmpName = user.name.split(' ');
    const first = tmpName[0];
    const last = tmpName[1];
    const userForm = generateUserFormHTML(user.name, first, last,  user.username, user.age, user.email);
    $('#edit-user-admin').append(userForm).fadeIn();
    addCancelListener();
    addUserPutListener(user);
}

function addCancelListener(){
    $('.edit-cancel').on('click', function(e){
        e.preventDefault();
        //clear form
        clearForm('.userEditForm');
        $('#edit-user').fadeOut();
    })
}

function addUserDeleteListener(){
    $('.user-delete').on('click', function(e){
        e.preventDefault();
        const playerID = $(this).parent().attr('data-attr');
        deleteUserMatches(playerID); 
        userDelete(playerID);
    });
}

function userDelete(ID){
    $.ajax({
        url: `${BASE_URL}/users/${ID}`,
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

function deleteUserMatches(playerID){
    const userMatches = currentMatches.filter(match => {
        return match.defender._id === playerID || match.challenger._id === playerID;
    });
    userMatches.forEach(match => deleteMatch(match.id));
}

function addUserPutListener(user){
    $('.userEditForm').submit(function(e){
        e.preventDefault();
        const firstName = $('input[id=new-first]').val();
        const lastName = $('input[id=new-last]').val();
        const userName = $('input[id=new-username]').val();
        const age = $('input[id=new-age]').val();
        const email = $('input[id=new-email]').val();
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
        putUser(user.id, userObj);
        $('#edit-user-admin').fadeOut();
        clearForm('.userEditForm');
    });
}

function putUser(ID, userObj){
    $.ajax({
        url: `${BASE_URL}/users/${ID}`,
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
        url: `${BASE_URL}/matches`,
        method: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(matchObj),
        processData: false,
        headers: {
            'Authorization': sessionStorage.getItem('userToken')
        },
        success: function(response){
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
   putUser(matchObj.defender, defObj);
    putUser(matchObj.challenger, chalObj);
}


function addMyMatchesListener(){
    $('.my-matches').on('click', function(e){
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
        e.preventDefault();
        const matchID = $(this).parent().attr('data-attr');
        //need a get for specific matches
        getMatch(matchID);
        $('#scoreboard').fadeIn();
    });
}

//clicks register for each delete...why? how to stop
function addMatchDeleteListener(defID, chalID){
    $('.del-challenge').on('click', function(e){
        e.stopPropagation();
        e.preventDefault();
        const matchID = $(this).parent().attr('data-attr');
        deleteMatch(matchID);
    });
}

function getMatch(matchID){
    $.ajax({
        url: `${BASE_URL}/matches/${matchID}`,
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
        if(defSet3 == null && chalSet3 == null ){
            chalSet3 = defSet3 = 0;
        }

        tallyScore(match, defSet1, defSet2, defSet3, chalSet1, chalSet2, chalSet3);
        $('#scoreboard').fadeOut();
    });
}

function tallyScore(match, def1, def2, def3, chal1, chal2, chal3){
    let rankingChange = false;
    firstMatch = false;
    let defSets = 0;
    let chalSets = 0;
    // let chalTB1 = chalTB2 =chalTB3 = defTB1 = defTB2 = defTB3 = 0;
    if(def1 > chal1) { defSets++;}
    else{ chalSets++;}
    if(def2 > chal2) { defSets++;}
    else{ chalSets++;}
    if(def3 > chal3) { defSets++;}
    else{ chalSets++;}
    const matchWinner = defSets > chalSets ? match.defender: match.challenger;
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

    matchUpdate(match.id, matchUpdateObj);
    if(rankingChange){
        // what is defender's rank? 
        const rankings = ladderRankings.map(player => player._id);
        const defenderRank = rankings.indexOf(match.defender._id);
        const ladderObj = {"id": ladderID, "defender": match.defender._id, "challenger": match.challenger._id, "isActive": true};
        updateLadder(ladderObj);
        sessionStorage.setItem('currentUserRank', defenderRank);
    } else if(!isActive){  
        //set challenger isActive to true     
        isActive = true;
        const userObj = {"id": match.challenger._id,"isActive": true};
        putUser(match.challenger._id, userObj)
        //put challenger on bottom rung
        const ladderObj = {"id": ladderID, "isActive": true, "new": match.challenger._id};
        updateLadder(ladderObj);
    }
}

    function matchUpdate(matchID, matchUpdateObj){
    $.ajax({
        url: `${BASE_URL}/matches/${matchID}`,
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
    showMyMatches(data.matches);
    })
    .fail(function(err){
        console.log(err);
    });
}

function showMatches(matchData){
    //clear match div
    $('#match-container').html('');
    $('#match-container').append('<h3>Completed Matches:</h3>');
    $('#challenge-container').html('');
    $('#challenge-container').append('<h3>Current Challenges:</h3>');
    
    matchData.forEach(function(match){
        const myMatch = false;
        if(match.matchPlayed){
            const winnerName = `${match.winner.name.firstName.charAt(0)}. ${match.winner.name.lastName}`;
            const loserName = `${match.loser.name.firstName.charAt(0)}. ${match.loser.name.lastName}`;
            const firstSet = `${match.score[0].winnerGames}-${match.score[0].loserGames}`;
            const secondSet = `${match.score[1].winnerGames}-${match.score[1].loserGames}`;
            const thirdSet = `${match.score[2].winnerGames}-${match.score[2].loserGames}`;
            const matchDiv = generateMatchHTML(winnerName, loserName, firstSet, secondSet, thirdSet);
            $('#match-container').append(matchDiv);

        } else  {  //unplayed challenge
            const defenderName = `${match.defender.name.firstName.charAt(0)}. ${match.defender.name.lastName}`;
            const challengerName = `${match.challenger.name.firstName.charAt(0)}. ${match.challenger.name.lastName}`;
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
    return `<div class="challenge" data-attr=${id}>${challenger} vs ${defender}
            <button type="button" class="record" style=${!myMatch?"display:none":"display:inline"}>Record</button>
            <button type="button" class="del-challenge" style=${!myMatch?"display:none":"display:inline"}>Delete</button>
            </div>`;
}

//-----------------
function showMyMatches(matchData){
    //clear match div
    $('#my-matches-container').html('');
    $('#my-matches-container').append('<h3>Completed Matches:</h3>');
    $('#my-challenges-container').html('');
    $('#my-challenges-container').append('<h3>Current Challenges:</h3>');
    const user = sessionStorage.getItem('currentUserID');
    
    matchData.forEach(function(match){
        const myMatch = user === match.challenger._id || user === match.defender._id?true:false;
        if(myMatch){ 
            if(match.matchPlayed){
                const winnerName = `${match.winner.name.firstName.charAt(0)}. ${match.winner.name.lastName}`;
                const loserName = `${match.loser.name.firstName.charAt(0)}. ${match.loser.name.lastName}`;
                const firstSet = `${match.score[0].winnerGames}-${match.score[0].loserGames}`;
                const secondSet = `${match.score[1].winnerGames}-${match.score[1].loserGames}`;
                const thirdSet = `${match.score[2].winnerGames}-${match.score[2].loserGames}`;
                const matchDiv = generateMatchHTML(winnerName, loserName, firstSet, secondSet, thirdSet);
                $('#my-matches-container').append(matchDiv);
            } else  {  //unplayed challenge
                const defenderName = `${match.defender.name.firstName.charAt(0)}. ${match.defender.name.lastName}`;
                const challengerName = `${match.challenger.name.firstName.charAt(0)}. ${match.challenger.name.lastName}`;
                const matchID = match.id;
                const challengeDiv = generateChallengeHTML(myMatch, defenderName, challengerName, matchID);
                $('#my-challenges-container').append(challengeDiv);
                addRecordListener();
                addMatchDeleteListener(match.defender._id, match.challenger._id);
            }
        }
    });
}

//-----------------
function getMatches(){
    $.ajax({
        url: `${BASE_URL}/matches`,
        headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('userToken')},
        method: "GET",
        dataType: 'json'
    })
    .done(function(data){
        currentMatches = data.matches;
        showMatches(data.matches);
        showMyMatches(data.matches);   
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
        url: `${BASE_URL}/matches/${matchID}`,
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
    ladderData.forEach(function(place, index) {
        if(place.name){
            const playerName = `${place.name.firstName} ${place.name.lastName}`;
            const playerID = place._id;
            rank = index + 1;
            const rungDiv = createRungHTML(rank, playerName, playerID);
            $('#ladder-container').append(rungDiv);
        }
        //if player is new/inActive append as last rung with no ranking
    });
    const playerName = sessionStorage.getItem('currentName');
    if(playerName  && !isActive){
        rank = ladderData.length + 1;
        const lastRung = createRungHTML(rank, playerName, sessionStorage.getItem('currentUserID'));
        $('#ladder-container').append(lastRung);
    }
    addChallengeListener(rank);
}

function getLadder(ladder){
    $.ajax({
        url: `${BASE_URL}/ladders/${ladder}`,
        method: "GET",
        dataType: 'json'
    })
    .done(function(data){ 
        const ladderData = data.rankings;
        ladderRankings = ladderData;
        showLadder(ladderData);
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
    $.ajax({
        url: `${BASE_URL}/ladders/${ladderID}`,
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