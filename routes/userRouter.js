var express = require('express');
var router = express.Router();
var passport = require('passport');
var mysql = require('mysql');
var details = require('../database/details');

var connection = mysql.createConnection(details.connection);

connection.query('USE ' + details.database);

router.route('/')
  .get(rootAuthentication, function (req, res) {
    res.render('index.ejs');
  });

router.route('/login')
  .get(function (req, res) {
    res.render('login.ejs', {message: req.flash('loginMessage')});
  })
  .post(passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

router.route('/signup')
  .get(function (req, res) {
    res.render('signup.ejs', {message: req.flash('signupMessage')});
  })
  .post(passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

router.route('/profile')
  .get(isLoggedIn, function (req, res) {
    var orders;
    connection.query('SELECT * FROM orders WHERE orders.id = ? AND orders.did IS NOT NULL',[req.user.id], function (err, rows) {
      if (err) {throw err;}
      orders = rows;
      console.log(orders);
      res.render('profile.ejs', {
        user: req.user,
        orders: orders
      });
    });
  });

//Route manage drivers
router.route('/manageDrivers')
  .get(isLoggedIn, function (req, res) {
    res.render('manageDrivers.ejs', {
      user: req.user
    });
  });

router.route('/driverlogin')
  .get(function (req, res) {
    res.render('driverLogin.ejs', {message: req.flash('loginMessage')});
  })
  .post(passport.authenticate('local-driverLogin', {
    successRedirect: '/driverProfile',
    failureRedirect: '/driverlogin',
    failureFlash: true
  }));

router.route('/driverProfile')
  .get(isLoggedIn, function (req, res) {
    res.render('driverProfile.ejs', {
      user: req.user
    });
  });

// LOGOUT
router.route('/logout')
  .get(function (req, res) {
    req.logout();
    res.redirect('/');
  });

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function rootAuthentication (req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/profile');
  }
  next();
}

module.exports = router;
