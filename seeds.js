const mongoose = require('mongoose'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment');

let seedData = [
  {
    name: `Cloud's Rest`,
    image: `https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae cumque fuga molestiae dignissimos nam laudantium. Minus fugiat quo quis est, necessitatibus quibusdam! Rerum, doloremque sit doloribus in quo dolore. Quae.`
  },
  {
    name: `Desert Mesa`,
    image: `https://images.unsplash.com/photo-1525209149972-1d3faa797c3c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`,
    description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita repellat dolorem aspernatur beatae, repellendus nemo. Sit placeat excepturi atque expedita, ea veritatis asperiores repudiandae ducimus. Quas quam nam autem? Molestiae!`
  },
  {
    name: `Canyon Floor`,
    image: `https://images.unsplash.com/photo-1533575770077-052fa2c609fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`,
    description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab quibusdam numquam incidunt eos nam laboriosam iste harum? Ex omnis iste aspernatur voluptatum suscipit, voluptatem quo, tenetur quae molestias neque recusandae.`
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
