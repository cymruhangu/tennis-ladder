const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	userName: {
		type: String,
		required: true,
		unique: true
	},
	DOB: {type: Date, default: '1/1/1970'},
  gender: {type: String, default: "male"},
  ladders: {[{type: mongoose.Schema.Types.ObjectId, ref: 'Ladder'}]},
  dateJoined: {type: Date, default: Date.now},
  isActive: {type: Boolean, default: false},
  matches: [{type: mongoose.Schema.Types.ObjectId, ref: 'Match'}]
});


// // Customize output for `res.json(data)`, `console.log(data)` etc.
// userSchema.set('toObject', {
// 	virtuals: true,     // include built-in virtual `id`
//     versionKey: false,  // remove `__v` version key
//     transform: (doc, ret) => {
//       delete ret._id; // delete `_id`
//     }
// });

module.exports = mongoose.model('User', userSchema);

