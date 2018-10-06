// insert modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
var Toursite = require('./models/toursite');
var Comment = require("./models/comment");
var User = require('./models/user');
var seedDB = require('./seeddb');

mongoose.connect('mongodb://localhost:27017/venezuela_tours', { useNewUrlParser: true });
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
seedDB();

//passport config

app.use(require('express-session')({
  secret: "Akira es demasiado hermosa",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
})

app.get("/toursites", function(req, res) {
  Toursite.find({}, function (err, toursites) {
    if(err){
      console.log(err);
    } else {
      res.render("toursites/index", {sites: toursites});
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
  res.render("toursites/new");
});

app.get("/toursites/:id", function(req, res){
  Toursite.findById(req.params.id).populate("comments").exec(function (err, foundSite){
    if(err){
      console.log(err);
    } else {
      res.render("toursites/show", { toursite: foundSite });
    }
  });
});

app.get("/", function(req, res){
  res.render('landing');
});

app.get("/toursites/:id/comments/new", LoggedIn, function(req, res){
  Toursite.findById(req.params.id, function (err, toursite) {
    if (err){
      console.log(err);
    } else {
      res.render("comments/new", {toursite: toursite});
    }
  });
});

app.post("/toursites/:id/comments", LoggedIn, function (req, res) {
  var comment = req.body.comment;
  Toursite.findById(req.params.id, function (err, toursite) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(
          {
              text: comment.text,
              author: comment.author
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

//AUTH routes
app.get("/register", function (req, res) {
  if(req.isAuthenticated()){
    res.redirect("/");
  } else {
    res.render('register');
  }
});

app.post("/register", function (req, res) {
  let newUser = new User({username:req.body.username});
  User.register(newUser, req.body.password, function (err, user) {
    if (err){
      console.log(err);
      res.render("/register");
    }
    passport.authenticate('local')(req, res, function (){
      res.redirect("/toursites")
    })
  });
});

app.get("/login", function (req, res) {
  if(req.isAuthenticated()){
    res.redirect("/");
  } else {
  res.render('login');
  }
});

app.post('/login', passport.authenticate("local", {
  successRedirect: "/toursites",
  failureRedirect: "/login"
}), function (req, res) {
});

app.get("/logout", function (req, res) {
  if(req.isAuthenticated()){
    req.logout();
    res.redirect("/toursites");
  } else {
    res.redirect("/");
  }
});

function LoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, function(){
  console.log("Venezuela Tour has started");
});
