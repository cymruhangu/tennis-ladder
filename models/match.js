const mongoose = require("mongoose");


const matchSchema = new mongoose.Schema ({
  ladder: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Ladder'
  },
  winner: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
  winner: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
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

});

const scoreSchema = new mongoose.Schema({
  sets:[Set]
});

const setSchema = new mongoose.Schema({
  winnerGames: {Type: number, defaults: 0},
  loserGames: {Type: number, defaults: 0},
  loserTiebreak: {Type: number, defaults: 0}
});


module.exports = mongoose.model('Match', matchSchema);
module.exports = mongoose.model('Score', scoreSchema);
module.exports = mongoose.model('Set', setSchema);