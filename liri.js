require("dotenv").config();
var fs = require('fs');
var keys = require("./key.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var Omdb = require("omdb");
var request = require('request');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdb = keys.omdb.apiKey;
var params = {user_id: '0utDoorsForLife'};
var command = process.argv[2];
var spotSearch = process.argv.slice(3).join(" ");
var movieSearch = process.argv.slice(3).join(" ");

if(command == 'my-tweets'){
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            //uncomment to post tweets===================================
            // client.post('statuses/update', {status: 'Node.js post'})
            // .then(function (tweet) {
            //   console.log(tweet);
            // })
            // .catch(function (error) {
            //   throw error;
            // })
            //============================================================
            for (var i = 0; i<20; i++){
            //Get tweets object=============================
            //console.log(tweets[i])
                console.log("=====================================");
                console.log(tweets[i].text);
                console.log(tweets[i].created_at);
                console.log("=====================================");
            }
        }else{
            console.log("Nope!");
        }
      });
}
else if(command == "spotify-this-song"){
    //console.log(spotify);
    spotify.search({ type: 'track', query: spotSearch }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            spotify.search({ type: 'track', query: "The Sign" }, function(err, data) {
                if ( err ) {
                    
                    console.log('Error occurred: ' + err);
                    return;
                }
                console.log("=====================================");
                console.log("Artist: " + data.tracks.items[5].album.artists[0].name);
                console.log("Album Samples: " + data.tracks.items[5].album.external_urls.spotify);
                console.log("Song Title: " + data.tracks.items[5].name);
                console.log("Album Title: " + data.tracks.items[5].album.name);
                console.log("=====================================");
                
                // Do something with 'data' 
            });
            return
        }
        console.log("=====================================");
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Album Samples: " + data.tracks.items[0].album.external_urls.spotify);
        console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Album Title: " + data.tracks.items[0].album.name);
        console.log("=====================================");
        
        // Do something with 'data' 
    });
}
else if(command == "movie-this"){
    request(`http://www.omdbapi.com/?t=${movieSearch}&y=&plot=short&apikey=${omdb}`, function (error, response, body) {

        console.log(movieSearch);
        if (movieSearch!=undefined){
            if (!error && response.statusCode == 200) {
                var moviePar = JSON.parse(body, null, 2);
                console.log(`
                ===========================
                Title: ${moviePar.Title}
                Year: ${moviePar.Year}
                IMDB rating: ${moviePar.imdbRating}
                Rotten Tomatoes:  ${moviePar.Ratings[1].Value}
                Country of Origin: ${moviePar.Country}
                Language: ${moviePar.Language}
                Plot: ${moviePar.Plot}
                Actor: ${moviePar.Actors}
                ===========================`);
            }
        }
        else{
            movieSearch = "Mr. Nobody"
            request(`http://www.omdbapi.com/?t=${movieSearch}&y=&plot=short&apikey=${omdb}`, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var moviePar = JSON.parse(body, null, 2);
                    console.log(`
                    ===========================
                    Title: ${moviePar.Title}
                    Year: ${moviePar.Year}
                    IMDB rating: ${moviePar.imdbRating}
                    Rotten Tomatoes:  ${moviePar.Ratings[1].Value}
                    Country of Origin: ${moviePar.Country}
                    Language: ${moviePar.Language}
                    Plot: ${moviePar.Plot}
                    Actor: ${moviePar.Actors}
                    ===========================`);
                }
            });
        }
    });
}
else if(command == "do-what-it-says"){
    fs.readFile("random.txt","utf8", function(err, data) {
        if (err) throw err;
        //console.log(data);
        spotify.search({ type: 'track', query: data }, function(err, data) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
            console.log("=====================================");
            console.log("Artist: " + data.tracks.items[5].album.artists[0].name);
            console.log("Album Samples: " + data.tracks.items[5].album.external_urls.spotify);
            console.log("Song Title: " + data.tracks.items[5].name);
            console.log("Album Title: " + data.tracks.items[5].album.name);
            console.log("=====================================");
            var logThis = 
`=====================================
Artist: ${data.tracks.items[5].album.artists[0].name}
Album Samples: ${data.tracks.items[5].album.external_urls.spotify}
Song Title: ${data.tracks.items[5].name}
Album Title: ${data.tracks.items[5].album.name}
=====================================`
            fs.writeFile("log.txt", logThis , function(err) {

                // If the code experiences any errors it will log the error to the console.
                if (err) {
                  return console.log(err);
                }
              
                // Otherwise, it will print: "movies.txt was updated!"
                console.log("log.txt was updated!");
              
              });
        });
    });
    
};  

 

 

