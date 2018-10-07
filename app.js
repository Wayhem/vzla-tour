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
var toursiteRoutes = require('./routes/toursites');
var commentRoutes = require('./routes/comments');
var indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/venezuela_tours', { useNewUrlParser: true });
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
// seed db script
// seedDB();

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
});

app.use("/toursites", toursiteRoutes);
app.use("/toursites/:id/comments", commentRoutes);
app.use(indexRoutes);

app.listen(3000, function(){
  console.log("Venezuela Tour has started");
});
