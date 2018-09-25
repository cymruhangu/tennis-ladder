'use strict';
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const ladderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    minAge: Number,
    gender: String,
    region: {  number: {type: Number, default: 1}, description: String },
    rankings: [{ rank: Number,
                  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'} }
            ],
    isActive: {type: Boolean, default: false}
}); 

ladderSchema.pre('find', function(next) {
    this.populate('rankings.user');
    next();
  });
  
  ladderSchema.pre('findOne', function(next) {
    this.populate('rankings.user');
    next();
  });

ladderSchema.virtual('playerName').get(function(){
        return `${rankings.user.firstName} ${rankings.user.lastName}`;
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