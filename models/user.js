'use strict';
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    name: {
	    firstName: { type: String, default: '' },
	    lastName: { type: String, default: '' }},
	username: {
		type: String,
		required: true,
		unique: true
	},
	age: {type: Number, default: 19},
  gender: {type: String, default: "male"},
  ladders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ladder'}],
  dateJoined: {type: Date, default: Date.now},
  isActive: {type: Boolean, default: false},
  matches: [{type: mongoose.Schema.Types.ObjectId, ref: 'Match'}]
});

userSchema.virtual('playerName').get(function(){
    return `${this.name.firstName} ${this.name.lastName}`;
});

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        player: this.playerName,
        username: this.username,
        age: this.age,
        gender: this.gender,
        isActive: this.isActive,
        matches: this.matches
    }
}

const User = mongoose.model('User', userSchema);
module.exports = {User};
