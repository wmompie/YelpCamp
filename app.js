const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require(`mongoose`);

mongoose.connect(`mongodb://localhost:27017/yelp_camp`, {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set(`view engine`, `ejs`);

// SCEMA SETUP
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

const Campground = mongoose.model(`Campground`, campgroundSchema);

// Campground.create({}, (err, campground) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(`NEWLY CREATED CAMPGROUND: `);
//     console.log(campground);
//   }
// });

app.get(`/`, (req, res) => res.render(`landing`));

app.get(`/campgrounds`, (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render(`campgrounds`, { campgrounds: allCampgrounds });
    }
  });
});

app.get(`/campgrounds/new`, (req, res) => res.render(`new.ejs`));

app.post(`/campgrounds`, (req, res) => {
  // get data from form and add to campgrounds array
  const name = req.body.name;
  const image = req.body.image;
  const newCampground = { name: name, image: image };
  // create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // redirect back to campgrounds page
      res.redirect(`/campgrounds`);
    }
  });
});

app.listen(3000, () => console.log(`The YelpCamp Server Has Started!`));
