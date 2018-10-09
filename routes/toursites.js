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

router.get("/:id/edit", checkearPosterDeSite, function (req, res) {
    Toursite.findById(req.params.id, function (err, foundSite) {
      if (err) {
        console.log(err);
        res.redirect('back');
      } else {
          res.render("toursites/edit", {toursite:foundSite});
      }
    });
});

router.put("/:id", checkearPosterDeSite, function (req, res) {
  Toursite.findOneAndUpdate({_id: req.params.id}, req.body.toursite, function (err, updatedToursite) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.redirect("/toursites/" + req.params.id);
    }
  });
});

router.delete("/:id", checkearPosterDeSite, function (req, res) {
  Toursite.findOneAndDelete({_id: req.params.id}, function (err) {
    if (err){
      console.log(err);
      res.redirect("/toursites");
    } else {
      console.log("Erased toursite");
      res.redirect("/toursites");
    }
  });
});

function LoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

function checkearPosterDeSite(req, res, next) {
  if (req.isAuthenticated()){
    Toursite.findById(req.params.id, function (err, foundSite) {
      if (err) {
        console.log(err);
        res.redirect('back');
      } else {
        if (foundSite.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;
