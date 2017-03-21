var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;

app.use(express.static('public'));
app.get('/index.html', function (req, res) {
	
	console.log("Attempting to connect to db")
	// Connect to the db
	MongoClient.connect("mongodb://pokemoncards.win:27017/test", function(err, db) {
		if(!err) {
			console.log("We are connected");
			var cardsCollection = db.collection('cards');
			
			
			cardsCollection.find().toArray(function(err, cardDocs) {
				console.log("Printing docs from Array")
				cardDocs.forEach(function(card) {
					console.log("Doc from Array ");
					console.log(JSON.stringify(card));
				});
				db.close();
			});
		}else{
			console.log("error:" +error);
		}
	});
    res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/search_by_field', function (req, res) {
   // Prepare output in JSON format
   console.log("search_by_field");
   var field = req.query.field;
   var value = req.query.value;
   var cardsArray = [];
   
   
   MongoClient.connect("mongodb://pokemoncards.win:27017/test", function(err, db) {
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
			console.log("error:" +error);
		}
	});
    
})

var server = app.listen(8081, function () {
	console.log("Getting Server Info");
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port);

})