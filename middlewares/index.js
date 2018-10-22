let middlewareObj = {};
var Toursite = require('../models/toursite');
var Comment = require('../models/comment');

middlewareObj.checkearPosterDeSite = function (req, res, next) {
  if (req.isAuthenticated()){
    Toursite.findById(req.params.id, function (err, foundSite) {
      if (err || !foundSite) {
        req.flash('error', 'Sitio turístico no encontrado');
        res.redirect('back');
      } else {
        if (foundSite.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'No estás autorizado para realizar esa acción');
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash('error', 'Necesitas estar conectado para hacer eso');
    res.redirect("back");
  }
}

middlewareObj.checkearPosterDeComment = function (req, res, next) {
  if (req.isAuthenticated()){
    Toursite.findById(req.params.id, function (err, foundSite) {
      if (err || !foundSite) {
        req.flash('error', 'No se pudo encontrar ese Sitio turístico');
        return res.redirect('back');
      }
      Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err || !foundComment) {
          req.flash('error', 'Comentario no encontrado');
          res.redirect('back');
        } else {
          if (foundComment.author.id.equals(req.user._id)){
            next();
          } else {
            req.flash('error', 'No estás autorizado para realizar esa acción');
            res.redirect("back");
          }
        }
      });
    });
  } else {
    req.flash('error', 'Necesitas estar conectado para hacer eso');
    res.redirect("back");
  }
}

middlewareObj.LoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'Necesitas estar conectado para hacer eso')
  res.redirect('/login');
}

module.exports = middlewareObj;
