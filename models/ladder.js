'use strict';
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const User  = require('./user');

const ladderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    minAge: Number,
    gender: String,
    region: {  number: {type: Number, default: 1}, description: String },
    rankings: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    isActive: {type: Boolean, default: false}
}); 

ladderSchema.pre('find', function(next) {
    this.populate('rankings');
    next();
  });
  
  ladderSchema.pre('findOne', function(next) {
    this.populate('rankings');
    next();
  });

ladderSchema.virtual('playerName').get(function(){
        return `${rankings.firstName} ${rankings.lastName}`;
});

ladderSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        minAge: this.minAge,
        region: this.region,
        rankings: this.rankings,
        isActive: this.isActive
    }
}

const Ladder = mongoose.model('Ladder', ladderSchema);
module.exports = {Ladder};