var config = require("dotenv").config();
var keys = require("./keys");
//===========TWITTER=============
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
//===========SPOTIFY=============
// var Spotify = require('spotify');
// var spotify = new Spotify(keys.spotify);
//===========REQUEST=============
var requestCall = require('request');



var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
if (!error) {
    console.log(tweets);
}
});


console.log(client)