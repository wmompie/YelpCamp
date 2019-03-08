const mongoose = require('mongoose'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment');

let seedData = [
  {
    name: `Cloud's Rest`,
    image: `https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`,
    description: `blah blah blah blah blah`
  },
  {
    name: `Desert Mesa`,
    image: `https://images.unsplash.com/photo-1525209149972-1d3faa797c3c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`,
    description: `blah blah blah blah blah`
  },
  {
    name: `Canyon Floor`,
    image: `https://images.unsplash.com/photo-1533575770077-052fa2c609fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`,
    description: `blah blah blah blah blah`
  }
];

const seedDB = () => {
  // Remove all campgrounds
  Campground.remove({}, err => {
    if (err) {
      console.log(err);
    }
    console.log(`removed campgrounds!`);
    // add a few campgrounds
    seedData.forEach(seed => {
      Campground.create(seed, (err, campground) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`added a campground`);
          // create a comment
          Comment.create(
            {
              text: `This place is great, but I wish there was internet`,
              author: `Homer`
            },
            (err, comment) => {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log(`Created new comment`);
              }
            }
          );
        }
      });
    });
  });
  // add a few comments
};

module.exports = seedDB;
