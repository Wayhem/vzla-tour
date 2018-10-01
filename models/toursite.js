const mongoose = require('mongoose');

var toursiteSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Toursite", toursiteSchema);
