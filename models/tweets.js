const mongoose = require('mongoose');


const tweetSchema = mongoose.Schema({
   name : String, 
   username : String, 
   tweet : String, 
   date : Date,
   hashtag : [String], 
   likes : Number,
   likedBy : Array,
   userToken : { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});
   

const Tweet = mongoose.model('tweets', tweetSchema);
module.exports = Tweet;