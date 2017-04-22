var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var database = require('./config/database');


// -- Set up which database we are connecting to according to command line
//    arguments.
var dbhost = database.url;
console.log(" -- setting dbhost as "+dbhost);


// -- Use public folder
app.use(express.static('public'));


// -- Routes
app.get('/', function (req, res) {
	console.log("dirname value:"+__dirname)
  res.render("cards/index.jade", {title: 'home'});
})
app.get('/cards', function (req, res) {
	console.log("dirname value:"+__dirname)
    res.sendFile( __dirname + "/public/cards/index.html" );
  })

app.get('/cards/search', function(req, res){
   var fields = req.query.fields;
   var cardsArray = [];

   MongoClient.connect(dbhost, function(err, db) {

		if(!err) {
      console.log("fields:" + fields);
      console.log(fields.name);
			console.log("We are connected");
      db = db.db(database.database);
			var cardsCollection = db.collection('cards');

			cardsCollection.find({"name": "Golduck"}).toArray(function(err, cardDocs) {

        console.log("Printing docs from Array")
				cardDocs.forEach(function(card) {
					console.log("Doc from Array ");
					console.log(JSON.stringify(card));
					cardsArray.push(card);

				});
				response = {
					"cards": cardsArray
				};
				console.log(response);
				res.end(JSON.stringify(response));
				db.close();
			});
		}else{
			console.log("error:" +err);
			res.end("error: "+err);
		}
	});
})


app.get('/cards/advanced_search', function(req, res){
   var fieldsRaw = req.query.fields;
   console.log("fields:"+fieldsRaw);
   var fields = fieldsRaw.split(",");
   var value = req.query.value;

   var cardsArray = [];
   MongoClient.connect(dbhost, function(err, db) {

		if(!err) {
      console.log("fields:" + fields);
			console.log("We are connected");
			var cardsCollection = db.collection('cards');
			console.log("value: "+value);

      var query = {};
      fields.forEach(function(field) {
        query[field] = value;
      });

			cardsCollection.find(query).toArray(function(err, cardDocs) {
				console.log("Printing docs from Array")
				cardDocs.forEach(function(card) {
					console.log("Doc from Array ");
					console.log(JSON.stringify(card));
					cardsArray.push(card);

				});
				response = {
					"cards": cardsArray
				};
				console.log(response);
				res.end(JSON.stringify(response));
				db.close();
			});
		}else{
			console.log("error:" +err);
			res.end("error: "+err);
		}
	});
})

app.get('/search_by_field', function (req, res) {
   // Prepare output in JSON format
   console.log("search_by_field");
   var field = req.query.field;
   var value = req.query.value;
   var cardsArray = [];


   MongoClient.connect(dbhost, function(err, db) {

		if(!err) {
			console.log("We are connected");
			var cardsCollection = db.collection('cards');

			console.log("field: "+field);
			console.log("value: "+value);

			var query = {};
			query[field] = value;
			cardsCollection.find(query).toArray(function(err, cardDocs) {
				console.log("Printing docs from Array")
				cardDocs.forEach(function(card) {
					console.log("Doc from Array ");
					console.log(JSON.stringify(card));
					cardsArray.push(card);

				});
				response = {
					"cards": cardsArray
				};
				console.log(response);
				res.end(JSON.stringify(response));
				db.close();
			});
		}else{
			console.log("error:" +err);
			res.end("error: "+err);
		}
	});
})

var server = app.listen(8081, function () {
	console.log("Getting Server Info");
   var host = server.address().address;
   var port = server.address().port;
   console.log("pokemoncards.win app listening at http://%s:%s", host, port);

})
