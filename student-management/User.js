const mongoose = require('mongoose');
const id = mongoose.Schema.Types.ObjectId;
const User = new mongoose.Schema({
    _id : {type:Number},
    name: {type:String},
    score: {type:Number},
    studentID: { type: Number }
});

mongoose.model('User', User);
module.exports = mongoose.model('User');