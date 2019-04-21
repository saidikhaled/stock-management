const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport')
const flash = require('connect-flash');
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts');

var app = express();

// Passport Config
require('./config/passport')(passport);


// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/stock-management", {
    useNewUrlParser: true
  })
  .then(() => console.log('Mongodb connected ..'))
  .catch(err => console.log(err));


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());

//static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js'))); // redirect bootstrap JS
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css'))); // redirect CSS bootstrap
app.use('/fontawesome', express.static(path.join(__dirname, '/node_modules/@fortawesome/fontawesome-free'))); // redirect CSS bootstrap

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})





app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/ficheMatiere', require('./routes/ficheMatiere'));




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;