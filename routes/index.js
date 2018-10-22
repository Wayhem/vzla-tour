const express = require('express');
var router = express.Router();
var User = require('../models/user');
const passport = require('passport');

router.get("/", function(req, res){
  res.render('landing');
});

//AUTH routes
router.get("/register", function (req, res) {
  if(req.isAuthenticated()){
    res.redirect("/");
  } else {
    res.render('register');
  }
});

router.post("/register", function (req, res) {
  let newUser = new User({username:req.body.username});
  User.register(newUser, req.body.password, function (err, user) {
    if (err){
      return res.render("register", {"error": err.message});
    }
    passport.authenticate('local')(req, res, function (){
      req.flash('success', 'Bienvenido a Venezuela Tours ' + user.username);
      res.redirect("/toursites")
    })
  });
});

router.get("/login", function (req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/toursites",
  failureRedirect: "/login"
}), function (req, res) {
});

router.get("/logout", function (req, res) {
  if(req.isAuthenticated()){
    req.logout();
    req.flash('success', 'Sesión ha sido cerrada.')
    res.redirect("/toursites");
  } else {
    res.redirect("/");
  }
});

module.exports = router;
