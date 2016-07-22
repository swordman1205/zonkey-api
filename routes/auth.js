var mongo = require('../database/mongo.js');
var _ = require('lodash');

var auth = {
  login: function(req, res) {
    mongo.login(req.query, function(err, user) {
      if (err) {
        res.send(JSON.stringify(err.message));
      } else {
        if (user) {
          res.send(JSON.stringify(user));
        } else {
          var errorMsg = "Invalid username or password!"
          res.send(JSON.stringify(errorMsg));
        }
      }
    });
  }
}

module.exports = auth;