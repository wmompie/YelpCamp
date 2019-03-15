const express = require('express'),
  router = express.Router({ mergeParams: true }),
  Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  middleware = require('../middleware');

// Comments New
router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn, (req, res) => {
  // find campground  by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err || !campground) {
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

// Comments Create
router.post('/campgrounds/:id/comments', middleware.isLoggedIn, (req, res) => {
  // lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err || !campground) {
      req.flash('error', err.message);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', `Something went wrong`);
          res.redirect('back');
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash('success', `Successfully added comment`);
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// Edit Comments
router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err || !foundCampground) {
      req.flash('error', `No campground found`);
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        req.flash('error', err.message);
        res.redirect('back');
      } else {
        res.render('comments/edit', {
          campground_id: req.params.id,
          comment: foundComment
        });
      }
    });
  });
});

// Update Comments
router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      req.flash('success', `Your comment has been updated`);
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

// Destroy Comments
router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('back');
    } else {
      req.flash('success', `Comment deleted`);
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

module.exports = router;
