const express = require('express'),
  methodOverride = require('method-override'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  app = express();

const User = require('./models/user'),
  seedDB = require('./seeds');

const commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index');

// DB Config
const db = require('./config/keys').mongoURI;

// onnect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(flash());
app.set('view engine', 'ejs');
// seedDB(); // seed the database

// PASSPORT CONFIG
app.use(
  require('express-session')({
    secret: `Campgrounds are the best places to rest!`,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The YelpCamp Server Has Started on port ${PORT}!`));
