'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
require('mongoose-type-email');
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
    password: {
        type: String,
        required: true
    },
    email: { type: mongoose.SchemaTypes.Email, default: 'blah@blah.com'},
	age: {type: Number, default: 19},   //***This should be DOB so system can determine age****
    gender: {type: String, enum: ["male", "female"], default: "male"},
    ladders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ladder', default: "5b8b17c354c1e18445736711"}],
    dateJoined: {type: Date, default: Date.now},
    isActive: {type: Boolean, default: false},
    matches: [{type: mongoose.Schema.Types.ObjectId, ref: 'Match'}],
    lastMatch: {type: Date}
});


//populate middleware
// userSchema.pre('find', function(next) {
//     this.populate('name');
//     next();
//   });
  
// userSchema.pre('findOne', function(next) {
//     this.populate('name');
//     next();
//   });

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};
  
userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};
  

userSchema.virtual('playerName').get(function(){
    return `${this.name.firstName} ${this.name.lastName}`;
});

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.playerName,
        username: this.username,
        age: this.age,
        email: this.email,
        gender: this.gender,
        ladders: this.ladders,
        matches: this.matches,
        isActive: this.isActive
    }
}

const User = mongoose.model('User', userSchema);
module.exports = {User};
