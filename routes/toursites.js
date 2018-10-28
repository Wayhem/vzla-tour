const express = require('express');
var router = express.Router();
var Toursite = require('../models/toursite');
var middleware = require('../middlewares');


router.get("/", function(req, res) {
  if (req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Toursite.find({'name': regex}, function (err, toursites) {
      if(err){
        req.flash('error', 'Algo ha pasado');
        console.log(err);
      } else {
        if (toursites.length < 1) {
          req.flash('error', 'No se ha encontrado ningún sitio');
          return res.redirect('back');
        } else {
          res.render("toursites/index", {sites: toursites, page: 'toursites'});
        }
      }
    });
  } else {
    Toursite.find({}, function (err, toursites) {
      if(err){
        req.flash('error', 'Algo ha pasado');
        console.log(err);
      } else {
        res.render("toursites/index", {sites: toursites, page: 'toursites'});
      }
    });
  }
});

router.post("/", middleware.LoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.body;
  let price = req.body.price;
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  var newToursite = {name: name, image: image, description: desc, price: price, author: author};

  Toursite.create(newToursite, function (err, newCreat){
    if(err){
      req.flash('error', 'Algo ha pasado');
      res.redirect('back');
    } else {
      req.flash('success', 'Sitio turístico exitosamente añadido');
      res.redirect("/toursites");
    }
  });
});

router.get("/new", middleware.LoggedIn, function(req, res) {
  res.render("toursites/new");
});

router.get("/:id", function(req, res){
  Toursite.findById(req.params.id).populate("comments").exec(function (err, foundSite){
    if(err || !foundSite){
      req.flash('error', 'Sitio turístico no encontrado');
      res.redirect('back');
    } else {
      res.render("toursites/show", { toursite: foundSite });
    }
  });
});

router.get("/:id/edit", middleware.checkearPosterDeSite, function (req, res) {
    Toursite.findById(req.params.id, function (err, foundSite) {
      if (err) {
        console.log(err);
        res.redirect('back');
      } else {
          res.render("toursites/edit", {toursite:foundSite});
      }
    });
});

router.put("/:id", middleware.checkearPosterDeSite, function (req, res) {
  Toursite.findOneAndUpdate({_id: req.params.id}, req.body.toursite, function (err, updatedToursite) {
    if (err) {
      req.flash('error', 'Algo ha pasado');
      console.log(err);
      res.redirect("/");
    } else {
      req.flash('success', 'Sitio turístico exitosamente editado');
      res.redirect("/toursites/" + req.params.id);
    }
  });
});

router.delete("/:id", middleware.checkearPosterDeSite, function (req, res) {
  Toursite.findOneAndDelete({_id: req.params.id}, function (err) {
    if (err){
      console.log(err);
      res.redirect("/toursites");
    } else {
      req.flash('success', 'Sitio turístico eliminado');
      res.redirect("/toursites");
    }
  });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
