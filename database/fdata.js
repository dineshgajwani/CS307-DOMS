var faker = require('faker');
var bcrypt = require('bcrypt-nodejs');

var users = [];

var mysql = require('mysql');
var details = require('./details');

var connection = mysql.createConnection(details.connection);

connection.query('USE ' + details.database);

for (var i = 1; i < 11; i++) {
  var newUser = {};
  newUser.username = faker.internet.userName();
  newUser.password = bcrypt.hashSync("12345", null, null);
  newUser.storename = faker.company.companyName();
  newUser.storeemail = faker.internet.email();
  newUser.storephone = faker.phone.phoneNumber();
  newUser.storephone = newUser.storephone.substring(0,11).replace(/[^0-9]/g, "");
  newUser.storeaddress = faker.address.streetAddress();

  var insertUser = "INSERT INTO users ( username, password, storename, storeemail, storephone, storeaddress) values (?,?,?,?,?,?)";

  connection.query(insertUser, [newUser.username, newUser.password, newUser.storename, newUser.storeemail, newUser.storephone, newUser.storeaddress], function (err, rows) {
    if (err) {console.log(err);}
      console.log("Added user");
    //newUser.id = rows.insertId;
    //return done(null, newUser);
  });

  for(var j = 0; j < 3; j++) {
    var driver = {};
    driver.username = faker.internet.userName();
    driver.password = bcrypt.hashSync("12345", null, null);
    driver.name = faker.name.findName();
    driver.address = faker.address.streetAddress();
    driver.email = faker.internet.email();
    driver.phone = faker.phone.phoneNumber();
    driver.phone = driver.phone.substring(0,11).replace(/[^0-9]/g, "");
    driver.id = i;

    var insertDriver = "INSERT INTO drivers (username, password, name, address, email, phone, id) values (?,?,?,?,?,?,?)";

    connection.query(insertDriver, [driver.username, driver.password, driver.name, driver.address, driver.email, driver.phone, driver.id], function (err, rows) {
      if(err) {throw err;}
      console.log("added driver");
    });
  }


  //users.push(newUser);
  //console.log(newUser);

}


// for(var j = 0; j < 15; j++) {
//   var driver = {};
//   driver.username = faker.internet.userName();
//   driver.password = bcrypt.hashSync("12345", null, null);
//   driver.name = faker.name.findName();
//   driver.address = faker.address.streetAddress();
//   driver.email = faker.internet.email();
//   driver.phone = faker.phone.phoneNumber();
//   driver.phone = driver.phone.substring(0,11).replace(/[^0-9]/g, "");

//   var insertDriver = "INSERT INTO drivers (username, password, name, address, email, phone, id) values (?,?,?,?,?,?,?)";

//   connection.query(insertDriver, [driver.username, driver.password, driver.name, driver.address, driver.email, driver.phone, driver.id], function (err, rows) {
//     if(err) {throw err;}
//     console.log("added driver");
//   });
// }
connection.end();
