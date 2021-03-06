
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var details = require('../database/details');

var connection = mysql.createConnection(details.connection);

connection.query('USE ' + details.database);

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

router.use(isLoggedIn);

router.route('/drivers')
  .get(function (req, res) {
    var data;
    connection.query('SELECT * FROM drivers WHERE drivers.id = ? ',[req.user.id], function (err, rows) {
      if (err) {throw err;}
      data = rows;
      res.render('drivers.ejs', {
        data: data
      });
      console.log(data);
      console.log("ALL DRIVERS");
      console.log(req.user.id);
    });
  })
  .post(function (req, res) {
    var driver = {
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
      price: req.body.price,
      id: req.user.id
    };
  });


router.route('/available')
  .get(function (req, res) {
    var data;
    connection.query('SELECT * FROM drivers WHERE drivers.id = ? AND drivers.status = 2',[req.user.id], function (err, rows) {
      if (err) {throw err;}
      data = rows;
      res.render('drivers.ejs', {
        data: data
      });
    });
  });

  router.route('/drivers/:id')
  .get(function (req, res) {
    var id = req.params.id;

    connection.query("SELECT * FROM drivers WHERE drivers.did = ? AND drivers.id = ?", [id, req.user.id], function (err, rows) {
      if(err) {throw err;}

      console.log(rows);
      res.render('singleDriver.ejs', {
        driver: rows[0]
      });
    });
  });
  router.route('/drivers/:id/delete')
  .get(function (req, res) {
    connection.query('DELETE FROM drivers WHERE drivers.did = ?', [req.params.id], function (err, rows) {
      if(err) {throw err;}
      res.redirect('/profile/drivers');
    });
  });
module.exports = router;
