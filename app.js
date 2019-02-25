const express = require(`express`),
  app = express(),
  bodyParser = require(`body-parser`),
  mongoose = require(`mongoose`);

mongoose.connect(`mongodb://localhost:27017/yelp_camp`, {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set(`view engine`, `ejs`);

// SCEMA SETUP
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

const Campground = mongoose.model(`Campground`, campgroundSchema);

// Campground.create(
//   {
//     name: `Granite Hill`,
//     image: `https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`,
//     description: `This is a huge granite hill, no bathrooms. No water. Beautiful granite!`
//   },
//   (err, campground) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(`NEWLY CREATED CAMPGROUND: `);
//       console.log(campground);
//     }
//   }
// );

app.get(`/`, (req, res) => res.render(`landing`));

// INDEX - show all campgrounds
app.get(`/campgrounds`, (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render(`index`, { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - add new campground to DB
app.post(`/campgrounds`, (req, res) => {
  // get data from form and add to campgrounds array
  const name = req.body.name,
    image = req.body.image,
    desc = req.body.description,
    newCampground = { name: name, image: image, description: desc };
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

// NEW - show form to create new campground
app.get(`/campgrounds/new`, (req, res) => res.render(`new.ejs`));

// SHOW - shows more info about one campgrounds
app.get(`/campgrounds/:id`, (req, res) => {
  // find the campground with provided ID
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      // render show template with that campground
      res.render(`show`, { campground: foundCampground });
    }
  });
});

app.listen(3000, () => console.log(`The YelpCamp Server Has Started!`));
