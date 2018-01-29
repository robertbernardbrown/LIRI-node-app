var config = require("dotenv").config();
var keys = require("./keys");
//===========TWITTER=============
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
//===========SPOTIFY=============
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
//=============IMDB==============
var requestCall = require('request');
//==============FS===============
var fs = require('fs')

switch (process.argv[2]) {

    case 'my_tweets':
        tweets();
        break;
    
    case 'spotify_this_song':
        spotifyFun(process.argv[3]);
        break;

    case 'movie_this':
        movieFun(process.argv[3]);
        break;

    case 'do_what_it_says':
        doIt();
        break;
    default:
        var errorComd = 'Please enter a command'
        console.log(errorComd)
        fs.appendFile('./log.txt', errorComd, 'utf-8', function (err) {
            if (err) throw err;
          });
}

function tweets() {
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
                var twitterText = counter++ + '. ' + element.created_at + ' ' + element.text + '\n'
                console.log(twitterText);
                fs.appendFile('./log.txt', twitterText, 'utf-8', function (err) {
                    if (err) throw err;
                  });
            }
        }
    });
}

function spotifyFun(arg) {
    if (!arg) {
        spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
            .then(function (data) {
                spotObj = {
                    artists: data.artists[0].name,
                    songName: data.name,
                    songLink: data.preview_url,
                    album: data.album.name
                }
                for (var i in spotObj) {
                console.log(spotObj[i]);
                fs.appendFile('./log.txt', spotObj[i] + '\n', 'utf-8', function (err) {
                    if (err) throw err;
                  });
                }
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
        return;
    }

    var params = {
        type: 'track',
        query: arg,
        limit: 1
    };
    spotify.search(params, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var spotifyArray = data.tracks.items;
        var spotObj = {};
        console.log("Here's some info on that song: ")
        for (var i = 0; i < spotifyArray.length; i++) {
            var element = spotifyArray[i],
                spotObj = {
                    artist: element.artists[0].name,
                    songName: element.name,
                    songLink: element.preview_url,
                    album: element.album.name
                }
                for (var i in spotObj) {
                    console.log(spotObj[i]);
                    fs.appendFile('./log.txt', spotObj[i] + '\n', 'utf-8', function (err) {
                        if (err) throw err;
                      });
                    }
        }
    });
}

function movieFun (arg) {
    if (!arg) {

        requestCall.get('http://www.omdbapi.com/?apikey=trilogy&t=Mr.+Nobody', function (error, response, body) {
          
            var parsedVar = JSON.parse(body);

            var movieObj = {
            movieTitle: 'Title: ' + parsedVar.Title,
            movieYear: 'Year: ' + parsedVar.Year,
            movieIMDBRating: 'IMDB Rating: ' + parsedVar.imdbRating,
            movieRTRatings: 'Rotten Tomatoes Rating: ' + parsedVar.Ratings[1].Value,
            movieCountry: 'Country: ' + parsedVar.Country,
            movieLanguage: 'Language: ' + parsedVar.Language,
            moviePlot: 'Plot: ' + parsedVar.Plot,
            movieActors: 'Actors: ' + parsedVar.Actors
            }

            for (var i in movieObj) {
                console.log(movieObj[i]);
                fs.appendFile('./log.txt', movieObj[i] + '\n', 'utf-8', function (err) {
                    if (err) throw err;
                  });
                }
        });
        return;
    }

    var userInput = arg;
    var editInput = userInput.replace(/\s/g, '+');

    requestCall.get('http://www.omdbapi.com/?apikey=trilogy&t=' + editInput, function (error, response, body) {
     
        var parsedVar = JSON.parse(body);

        if (parsedVar.Response === 'False') {
            console.log("IMDB can't find this movie, please try again")
            return
        }
     
        var movieObj = {
        movieTitle: 'Title: ' + parsedVar.Title,
        movieYear: 'Year: ' + parsedVar.Year,
        movieIMDBRating: 'IMDB Rating: ' + parsedVar.imdbRating,
        movieRTRatings: 'Rotten Tomatoes Rating: ' + parsedVar.Ratings[1].Value,
        movieCountry: 'Country: ' + parsedVar.Country,
        movieLanguage: 'Language: ' + parsedVar.Language,
        moviePlot: 'Plot: ' + parsedVar.Plot,
        movieActors: 'Actors: ' + parsedVar.Actors
        }

        for (var i in movieObj) {
            console.log(movieObj[i]);
            fs.appendFile('./log.txt', movieObj[i] + '\n', 'utf-8', function (err) {
                if (err) throw err;
              });
            }
    });
}

function doIt() {
    var filename = 'random.txt'

    fs.readFile(filename, 'utf8', function (err, data) {
        if (err) throw err;

        var newData = data.split(",")

        switch (newData[0]) {

            case 'my_tweets':
                tweets();
                break;

            case 'spotify_this_song':
                spotifyFun(newData[1]);
                break;

            case 'movie_this':
                movieFun(newData[1]);
                break;

            default:
                var errorTxt = 'Please enter text into the txt file'
                console.log(errorTxt)
                fs.appendFile('./log.txt', errorTxt, 'utf-8', function (err) {
                    if (err) throw err;
                  });
        }
    });

}