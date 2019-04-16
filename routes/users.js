const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

//Login page
router.get('/login', (req, res) => {
  res.render("login")
});

//register page
router.get('/register', (req, res) => {
  res.render("Register")
})







// register handler
router.post('/register', (req, res) => {

  const {
    firstName,
    lastName,
    userName,
    password,
    password2
  } = req.body;
  let errors = [];

  // chack required fields
  if (!userName || !firstName || !lastName || !password || !password2) {
    errors.push({
      msg: 'please fill in all the fields  '
    });
  }
  // check passwords match
  if (password !== password2) {
    errors.push({
      msg: 'passwords do not match'
    });
  }
  //check pass length
  if (password.length < 6) {
    errors.push({
      msg: 'password should be at least 6 charachters'
    });
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      userName,
      password,
      password2
    });
  } else {
    User.findOne({
        userName: userName
      })
      .then(user => {
        if (user) {
          //user exists
          errors.push({
            msg: 'User Name already exist'
          });
          res.render('register', {
            errors,
            firstName,
            lastName,
            userName,
            password,
            password2
          });
        } else {
          const newUser = new User({
            firstName,
            lastName,
            userName,
            password
          });
          console.log(req.body);
          // newUser.save()
          // .then( user => {
          //                    res.redirect('/users/login');
          //               })
          //                .catch(err => console.log(err));
          //Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          })
        }
      })
  }
})

// Login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'you are logged out');
  res.redirect('/users/login');
})

module.exports = router;