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

router.get("/:comment_id/edit", checkearPosterDeComment, function (req, res) {
  Comment.findById({_id: req.params.comment_id}, function (err, foundComment) {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      Toursite.findById({_id: req.params.id}, function (err, foundSite) {
        if (err) {
          console.log(err);
          res.redirect('back');
        } else {
          res.render('comments/edit', {comment:foundComment, toursite:foundSite});
        }
      });
    }
  });
});

router.put("/:comment_id", checkearPosterDeComment, function (req, res) {
    Comment.findOneAndUpdate({_id: req.params.comment_id}, req.body.comment, function (err, updatedComment) {
      if(err){
        res.redirect('back')
      } else{
        res.redirect('/toursites/' + req.params.id);
      }
    });
});

router.delete("/:comment_id", checkearPosterDeComment, function (req, res) {
  Comment.findOneAndDelete({_id: req.params.comment_id}, function (err){
    if (err){
      console.log(err);
      res.redirect("back");
    } else {
      console.log("Erased comment");
      res.redirect("/toursites/" + req.params.id);
    }
  });
});

function LoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

function checkearPosterDeComment(req, res, next) {
  if (req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        console.log(err);
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id)){
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
