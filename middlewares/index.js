let middlewareObj = {};
var Toursite = require('../models/toursite');
var Comment = require('../models/comment');

middlewareObj.checkearPosterDeSite = function (req, res, next) {
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

middlewareObj.checkearPosterDeComment = function (req, res, next) {
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

middlewareObj.LoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = middlewareObj;
