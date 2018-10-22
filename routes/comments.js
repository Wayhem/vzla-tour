const express = require('express');
var router = express.Router({mergeParams: true});
var Comment = require('../models/comment');
var Toursite = require('../models/toursite');
var middleware = require('../middlewares');

router.get("/new", middleware.LoggedIn, function(req, res){
  Toursite.findById(req.params.id, function (err, toursite) {
    if (err){
      console.log(err);
    } else {
      res.render("comments/new", {toursite: toursite});
    }
  });
});

router.post("/", middleware.LoggedIn, function (req, res) {
  var comment = req.body.comment;
  Toursite.findById(req.params.id, function (err, toursite) {
    if (err) {
      console.log(err);
      req.flash('error', 'Error inesperado');
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
              req.flash('error', 'Error inesperado');
            } else {
              toursite.comments.push(comentario);
              toursite.save();
              req.flash('success', 'Comentario añadido exitosamente');
              res.redirect("/toursites/"+toursite._id);
            }
          });
      }
  });
});

router.get("/:comment_id/edit", middleware.checkearPosterDeComment, function (req, res) {
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

router.put("/:comment_id", middleware.checkearPosterDeComment, function (req, res) {
    Comment.findOneAndUpdate({_id: req.params.comment_id}, req.body.comment, function (err, updatedComment) {
      if(err){
        res.redirect('back')
      } else{
        res.redirect('/toursites/' + req.params.id);
      }
    });
});

router.delete("/:comment_id", middleware.checkearPosterDeComment, function (req, res) {
  Comment.findOneAndDelete({_id: req.params.comment_id}, function (err){
    if (err){
      console.log(err);
      res.redirect("back");
    } else {
      req.flash('success', 'Comentario eliminado');
      res.redirect("/toursites/" + req.params.id);
    }
  });
});

module.exports = router;
