'use strict';
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const User  = require('./user');
const setSchema = new mongoose.Schema({
    setNum: {type: Number, min:1, max: 3},
    winnerGames: {type: Number, min: 0, max: 7},
    loserGames: {type: Number, min: 0, max: 7},
    lowerTieBreak: Number
});


const matchSchema = new mongoose.Schema({
    ladder: {type: mongoose.Schema.Types.ObjectId, ref: 'Ladder'},
    defender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    challenger: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    winner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    loser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    // score:[{setnum: {Number, min: 1, max: 3}, winnerGames: {}, loserGames:{}, lowerTieBreak: Number}],
    score: [ setSchema],
    challengeDate: {type: Date, default: Date.now},
    datePlayed: Date,
    matchPlayed: {type: Boolean, default: false}
});

//populate middleware
matchSchema.pre('find', function(next) {
    this.populate('winner');
    this.populate('loser');
    // console.log(`defender is ${defender}`);
    next();
  });
  
matchSchema.pre('findOne', function(next) {
    this.populate('winner');
    this.populate('loser');
    next();
  });


matchSchema.virtual('winnerName').get(function(){
    return `${this.winner.name.firstName} ${this.winner.name.lastName}`;
});

matchSchema.virtual('loserName').get(function(){
    return `${this.loser.name.firstName}  ${this.loser.name.lastName}`;
});

matchSchema.methods.serialize = function() {
    return {
        id: this._id,
        defender: this.defender,
        challenger: this.challenger,
        ladder: this.ladder,
        winner: this.winner,
        loser: this.loser,
        score: this.score,
        challengeDate: this.challengeDate,
        datePlayed: this.dataPlayed,
        matchPlayed: this.matchPlayed
    }
}


const Match = mongoose.model('Match', matchSchema);
module.exports = {Match};