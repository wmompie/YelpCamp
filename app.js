const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.set(`view engine`, `ejs`);

let campgrounds = [
  {
    name: `Salmon Creek`,
    image: `https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`
  },
  {
    name: `Granite Hill`,
    image: `https://images.unsplash.com/photo-1525209149972-1d3faa797c3c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`
  },
  {
    name: `Mountain Goat's Rest`,
    image: `https://images.unsplash.com/photo-1440262206549-8fe2c3b8bf8f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`
  }
];

app.get(`/`, (req, res) => res.render(`landing`));

app.get(`/campgrounds`, (req, res) => {
  res.render(`campgrounds`, { campgrounds: campgrounds });
});

app.get(`/campgrounds/new`, (req, res) => res.render(`new.ejs`));

app.post(`/campgrounds`, (req, res) => {
  // get data from form and add to campgrounds array
  let name = req.body.name;
  let image = req.body.image;
  const newCampground = { name: name, image: image };
  campgrounds.push(newCampground);
  // redirect back to campgrounds page
  res.redirect(`/campgrounds`);
});

app.listen(3000, () => console.log(`The YelpCamp Server Has Started!`));
