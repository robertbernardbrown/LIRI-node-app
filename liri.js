var config = require("dotenv").config();
var keys = require("./keys");
//===========TWITTER=============
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
//===========SPOTIFY=============
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
//===========REQUEST=============
var requestCall = require('request');

switch (process.argv[2]) {

    case 'my_tweets':

        var params = {
            screen_name: 'Bob_Brown18',
            count: 20
        };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                console.log('Here are your last 20 tweets: ');
                var counter = 1;
                for (var i = 0; i < tweets.length; i++) {
                    var element = tweets[i];
                    var twitterText = counter++ + '. ' + element.created_at + ' ' + element.text
                    console.log(twitterText);
                }
            }
        });
        break;
    
    case 'spotify_this_song':

        if (!process.argv[3]) {
            spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
            .then(function(data) {
                spotObj = {
                    artists: data.artists[0].name,
                    songName: data.name,
                    songLink: data.preview_url,
                    album: data.album.name
                }
              console.log(spotObj); 
            })
            .catch(function(err) {
              console.error('Error occurred: ' + err); 
            });
            break;
        }

        var params = {
            type: 'track',
            query: process.argv[3]
        };
        spotify.search(params, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var spotifyArray = data.tracks.items;
            var spotObj = {};
            console.log('Here are some songs that fit the bill: ')
            for (var i = 0; i < spotifyArray.length; i++) {
                var element = spotifyArray[i],
                    spotObj = {
                        artist: element.artists[0].name,
                        songName: element.name,
                        songLink: element.preview_url,
                        album: element.album.name
                    }
                console.log(spotObj)
            }
        });
        break;

    case 'movie_this':
        console.log('movie');
        break;
    case 'do_what_it_says':
        console.log('says');
        break;
    default:
        console.log('Please enter a request!');
}




// console.log(client)