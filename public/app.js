'use strict';

let MOCK_USERS = {
	"users": [
        {
            "id": "1111111",
            "username": "rnadal",
            "name": {
                firstName: 'Rafael',
                lastName: 'Nadal'
            },
            "age": 31,
            "gender": "male",
            "ladders": ["singlesOpen"],
            "dateJoined": 1470016976609,
            "isActive": true,
            "matches": ["5b8b17c398b8ca31ea41193e"]
        },
        {
            "id": "2222222",
            "username": "rfederer",
            "name": {
                firstName: 'Roger',
                lastName: 'Federer'
            },
            "age": 37,
            "gender": "male",
            "ladders": ["singlesOpen"],
            "dateJoined": 1470016976609,
            "isActive": true,
            "matches": ["5b8b17c398b8ca31ea41194f"]
        },
        {
            "id": "3333333",
            "username": "jdelpotro",
            "name": {
                firstName: 'Juan Martin',
                lastName: 'Del Potro'
            },
            "age": 29,
            "gender": "male",
            "ladders": ["singlesOpen"],
            "dateJoined": 1470016976609,
            "isActive": true,
            "matches": ["5b8b17c398b8ca31ea41193e"]
        },
        {
            "id": "4444444",
            "username": "azverev",
            "name": {
                firstName: 'Alexander',
                lastName: 'Zverev'
            },
            "age": 20,
            "gender": "male",
            "ladders": ["singlesOpen"],
            "dateJoined": 1470016976609,
            "isActive": true,
            "matches": []
        },
        {
            "id": "5555555",
            "username": "kanderson",
            "name": {
                firstName: 'Kevin',
                lastName: 'Anderson'
            },
            "age": 32,
            "gender": "male",
            "ladders": ["singlesOpen"],
            "dateJoined": 1470016976609,
            "isActive": true,
            "matches": ["5b8b17c398b8ca31ea41194f"]
        },
        {
            "id": "6666666",
            "username": "novak",
            "name": {
                firstName: 'Novak',
                lastName: 'Djokovic'
            },
            "age": 31,
            "gender": "male",
            "ladders": ["singlesOpen"],
            "dateJoined": 1470016976609,
            "isActive": true,
            "matches": []
        },
        {
            "id": "7777777",
            "username": "mcilic",
            "name": {
                firstName: 'Marin',
                lastName: 'Cilic'
            },
            "age": 28,
            "gender": "male",
            "ladders": ["singlesOpen"],
            "dateJoined": 1470016976609,
            "isActive": true,
            "matches": []
        },
        {
            "id": "8888888",
            "username": "gdimitrov",
            "name": {
                firstName: 'Grigor',
                lastName: 'Dmitrov'
            },
            "age": 26,
            "gender": "male",
            "ladders": ["singlesOpen"],
            "dateJoined": 1470016976609,
            "isActive": true,
            "matches": []
        },
        {
            "id": "9999999",
            "username": "dthiem",
            "name": {
                firstName: 'Dominic',
                lastName: 'Thiem'
            },
            "age": 22,
            "gender": "male",
            "ladders": ["singlesOpen"],
            "dateJoined": 1470016976609,
            "isActive": true,
            "matches": []
        },
        {
            "id": "10000000",
            "username": "dgoffin",
            "name": {
                firstName: 'David',
                lastName: 'Goffin'
            },
            "age": 27,
            "gender": "male",
            "ladders": ["singlesOpen"],
            "dateJoined": 1470016976609,
            "isActive": true,
            "matches": []
        },
        {
            "id": "11000000",
            "username": "jisner",
            "name": {
                firstName: 'John',
                lastName: 'Isner'
            },
            "age": 33,
            "gender": "male",
            "ladders": ["singlesOpen"],
            "dateJoined": 1470016976609,
            "isActive": true,
            "matches": []
        }
    ]
};

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
            "datePlayed": 1535987897 
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
            "datePlayed": 1535987897
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
            "datePlayed": 1535987897
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
            "datePlayed": 1535987897
        }
    ]
};

let MOCK_LADDERS =  {
    "ladders": [ 
        {
            "id": "123984102937492eb",
            "name": "singlesOpen",
            "rankings": [
                {"rung": 1, "player": "1111111"},
                {"rung": 2, "player": "2222222"},
                {"rung": 3, "player": "3333333"},
                {"rung": 4, "player": "4444444"},
                {"rung": 5, "player": "5555555"},
                {"rung": 6, "player": "6666666"},
                {"rung": 7, "player": "7777777"},
                {"rung": 8, "player": "8888888"},
                {"rung": 9, "player": "9999999"},
                {"rung": 10, "player": "10000000"},
                {"rung": 11, "player": "11000000"}
            ]    
        }
    ]
};

function showLadder(ladderName){
    MOCK_LADDERS.ladders[0].rankings.forEach(function(place) {
        const playerName = findPlayer(place.player);
        const rank = place.rung;
        const rungDiv = createRungHTML(rank, playerName);
        $('#ladder').append(rungDiv);
        });
}

function createRungHTML(rank, player){
    return `<div class="ladder-rung">${rank}:  ${player}
            <button type="button" class="challenge">Challenge</button>
            <button type="button" class="record">Record Score</button>
    </div>`
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

function createMatchHTML(winner, loser, first, second, third){
    return `<div class="match">${winner} d. ${loser} ${first}, ${second}, ${third}</div>`;
}

showLadder("singlesOpen");
showMatches();

$()

