// insert modules
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mongoose = require('mongoose');
var Toursite = require('./models/toursite');
var seedDB = require('./seeddb');

mongoose.connect('mongodb://localhost:27017/venezuela_tours', { useNewUrlParser: true });
var app = express();

// Toursite.create({
//   name:"Roraima",
//   image:"http://miriadna.com/desctopwalls/images/max/Mount-Roraima.jpg",
//   description: "En el sector Oriental del parque nacional Canaima, en medio de la región conocida como la \"Gran Sabana\", se encuentra el tepuy más alto de todos: El Roraima."
// }, function(err, toursite) {
//   if(err){
//     console.log(err);
//   } else {
//     console.log("New Toursite!");
//     console.log(toursite);
//   }
// });

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/toursites", function(req, res) {
  Toursite.find({}, function (err, toursites) {
    if(err){
      console.log(err);
    } else {
      res.render("index", {sites: toursites});
    }
  });
});

app.post("/toursites", function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newToursite = {name: name, image: image, description: desc};

  Toursite.create(newToursite, function (err, newCreat){
    if(err){
      console.log(err);
    } else {
      res.redirect("/toursites");
    }
  });
});

app.get("/toursites/new", function(req, res) {
  res.render("new");
});

app.get("/toursites/:id", function(req, res){
  Toursite.findById(req.params.id).populate("comments").exec(function (err, foundSite){
    if(err){
      console.log(err);
    } else {
      console.log(foundSite);
      res.render("show", { toursite: foundSite });
    }
  });
});

app.get("/", function(req, res){
  res.render('landing');
});

app.listen(3000, function(){
  console.log("Venezuela Tour has started");
});
