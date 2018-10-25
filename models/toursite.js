const mongoose = require('mongoose');
//remove deprecation warning from mongoose with .findOneAndUpdate which ends up using .findAndModify
mongoose.set('useFindAndModify', false);

var toursiteSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  author: {
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Toursite", toursiteSchema);
