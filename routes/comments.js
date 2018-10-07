const express = require('express');
var router = express.Router({mergeParams: true});
var Comment = require('../models/comment');
var Toursite = require('../models/toursite');

router.get("/new", LoggedIn, function(req, res){
  Toursite.findById(req.params.id, function (err, toursite) {
    if (err){
      console.log(err);
    } else {
      res.render("comments/new", {toursite: toursite});
    }
  });
});

router.post("/", LoggedIn, function (req, res) {
  var comment = req.body.comment;
  Toursite.findById(req.params.id, function (err, toursite) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(
          {
              text: comment.text,
              author: {
                id: req.user._id,
                username: req.user.username
              }
          }, function(err, comentario) {
            if (err) {
              console.log(err);
            } else {
              toursite.comments.push(comentario);
              toursite.save();
              res.redirect("/toursites/"+toursite._id);
            }
          });
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
