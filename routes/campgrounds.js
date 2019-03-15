const express = require('express'),
  router = express.Router(),
  Campground = require('../models/campground'),
  middleware = require('../middleware');

// INDEX - show all campgrounds
router.get('/campgrounds', (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - add new campground to DB
router.post('/campgrounds', middleware.isLoggedIn, (req, res) => {
  // get data from form and add to campgrounds array
  const name = req.body.name,
    price = req.body.price,
    image = req.body.image,
    desc = req.body.description,
    author = {
      id: req.user._id,
      username: req.user.username
    },
    newCampground = {
      name,
      price,
      image,
      description: desc,
      author
    };
  // create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      req.flash('success', `Your campground ${newlyCreated.name} was successfully created`);
      res.redirect('/campgrounds');
    }
  });
});

// NEW - show form to create new campground
router.get('/campgrounds/new', middleware.isLoggedIn, (req, res) => res.render('campgrounds/new'));

// SHOW - shows more info about one campgrounds
router.get('/campgrounds/:id', (req, res) => {
  // find the campground with provided ID
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash('error', `Campground not found`);
        res.redirect('back');
      } else {
        // render show template with that campground
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// EDIT Campground Route
router.get('/campgrounds/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', { campground: foundCampground });
  });
});

// UPDATE Campground Route
router.put('/campgrounds/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect(`/campgrounds/${updatedCampground._id}`);
    }
  });
});

// DESTROY Campground Route
router.delete('/campgrounds/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
