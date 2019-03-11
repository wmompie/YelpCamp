const express = require('express'),
  mongoose = require('mongoose'),
  pasport = require('passport'),
  LocalStrategy = require('passport-local'),
  app = express();

const Campground = require('./models/campground'),
  User = require('./models/user'),
  Comment = require('./models/comment'),
  seedDB = require('./seeds');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
seedDB();

app.get('/', (req, res) => res.render('landing'));

// INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - add new campground to DB
app.post('/campgrounds', (req, res) => {
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
      res.redirect('/campgrounds');
    }
  });
});

// NEW - show form to create new campground
app.get('/campgrounds/new', (req, res) => res.render('campgrounds/new'));

// SHOW - shows more info about one campgrounds
app.get('/campgrounds/:id', (req, res) => {
  // find the campground with provided ID
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        // render show template with that campground
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// =========================
// COMMENTS ROUTES
// =========================
app.get('/campgrounds/:id/comments/new', (req, res) => {
  // find campground  by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

app.post('/campgrounds/:id/comments', (req, res) => {
  // lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      let text = req.body.text;
      let author = req.body.author;
      Comment.create({ text, author }, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
  // create new comment
  // connect new comment to campground
  // redirect campground show page
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`The YelpCamp Server Has Started on port ${PORT}!`)
);
