$(function(){
'use strict';

addIndexListeners();

function addIndexListeners(){
    $('#sign-in').on('click', function(e){
        e.preventDefault();
        console.log('SIGN IN CLICKED');
    });
    $('#sign-up').on('click', function(e){
        e.preventDefault();
        console.log('SIGN UP CLICKED');
        $('#welcome').fadeOut();
        $('#registration').fadeIn();
        addRegisterListener();
    });
}

function addRegisterListener(){
    $('#ladderReg').submit(function(e){
        e.preventDefault();
        const firstName = $('input[id=first]').val();
        const lastName = $('input[id=last]').val();
        const userName = $('input[id=username]').val();
        const email = $('input[id=email]').val();
        const password = $('input[id=pwd]').val();
        const userPost = {
            
        }
    })
}

let MOCK_MATCHES = {
    "matches":[
        {
            "id": "5b8b17c398b8ca31ea41193e",
            "ladder": "5b8b17c354c1e18445736711",
            "winner": "1111111",
            "loser": "3333333",
            "score": {
                "set1": {
                    "winnerGames": 6,
                    "loserGames": 4
                },
                "set2": {
                    "winnerGames": 1,
                    "loserGames": 6
                },
                "set3": {
                    "winnerGames": 6,
                    "loserGames": 2
                }
            },
            "datePlayed": 1535987897,
            "challenger": "3333333",
            "defender": "1111111", 
            "matchPlayed": true
        },
        {
            "id": "5b8b17c398b8ca31ea41194f",
            "ladder": "5b8b17c354c1e18445736711",
            "winner": "2222222",
            "loser": "5555555",
            "score": {
                "set1": {
                    "winnerGames": 6,
                    "loserGames": 1
                },
                "set2": {
                    "winnerGames": 6,
                    "loserGames": 7
                },
                "set3": {
                    "winnerGames": 6,
                    "loserGames": 3
                }
            },
            "datePlayed": 1535987897,
            "challenger": "5555555",
            "defender": "2222222", 
            "matchPlayed": true
        },
        {
            "id": "5b8b17c3e62428d45fe1f9ab",
            "ladder": "5b8b17c354c1e18445736711",
            "winner": "3333333",
            "loser": "4444444",
            "score": {
                "set1": {
                    "winnerGames": 6,
                    "loserGames": 1
                },
                "set2": {
                    "winnerGames": 6,
                    "loserGames": 7
                },
                "set3": {
                    "winnerGames": 6,
                    "loserGames": 3
                }
            },
            "datePlayed": 1535987897,
            "challenger": "4444444",
            "defender": "3333333", 
            "matchPlayed": true
        },
        {
            "id": "5b8b17c354c1e18445736711",
            "ladder": "5b8b17c354c1e18445736711",
            "winner": "6666666",
            "loser": "8888888",
            "score": {
                "set1": {
                    "winnerGames": 6,
                    "loserGames": 1
                },
                "set2": {
                    "winnerGames": 6,
                    "loserGames": 7
                },
                "set3": {
                    "winnerGames": 6,
                    "loserGames": 3
                }
            },
            "datePlayed": 1535987897,
            "challenger": "8888888",
            "defender": "6666666", 
            "matchPlayed": true
        }
    ]
};


function showLadder(ladderData){
    ladderData.forEach(function(place) {
        if(place.user){
            const playerName = `${place.user.name.firstName} ${place.user.name.lastName}`;
            console.log(place);
            const rank = place.rank;
            const rungDiv = createRungHTML(rank, playerName);
            $('#ladder').append(rungDiv);
            addChallengeListener();
    }
    });
}

function getLadder(ladderId){
    $.ajax({
        url: `http://localhost:8080/ladders/${ladderId}`,
        method: "GET",
        dataType: 'json'
    })
    .done(function(data){
        console.log(data.rankings);
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

function addChallengeListener(){
    $('.challenge').on("click", function(event){
        // event.preventDefault();
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

function findPlayer(playerID){
    const player =  MOCK_USERS.users.find(function (user){
        return user.id === playerID;
    });
    return `${player.name.firstName} ${player.name.lastName}`;
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
        console.log(data);
    })
    .fail(function(err){
        console.log(err);
    })
}

function showUsers(){
    $.ajax({
        url: 'http://localhost:8080/users',
        method: "GET",
        dataType: 'json'
    })
    .done(function(data){
        console.log(data);
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
showUsers();


});