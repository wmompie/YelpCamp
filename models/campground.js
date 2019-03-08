const mongoose = require('mongoose');

// SCEMA SETUP
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

module.exports = mongoose.model('Campground', campgroundSchema);
