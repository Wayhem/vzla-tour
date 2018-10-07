const express = require('express');
var router = express.Router();
var Toursite = require('../models/toursite');

router.get("/", function(req, res) {
  Toursite.find({}, function (err, toursites) {
    if(err){
      console.log(err);
    } else {
      res.render("toursites/index", {sites: toursites});
    }
  });
});

router.post("/", LoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.body;
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  var newToursite = {name: name, image: image, description: desc, author: author};

  Toursite.create(newToursite, function (err, newCreat){
    if(err){
      console.log(err);
    } else {
      res.redirect("/toursites");
    }
  });
});

router.get("/new", LoggedIn, function(req, res) {
  res.render("toursites/new");
});

router.get("/:id", function(req, res){
  Toursite.findById(req.params.id).populate("comments").exec(function (err, foundSite){
    if(err){
      console.log(err);
    } else {
      res.render("toursites/show", { toursite: foundSite });
    }
  });
});

function LoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
