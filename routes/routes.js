var auth = require("./auth.js");

var router = function(app) {
  app.get("/", function(req, res) {
    res.send("Welcome! This is Zonkey API.");
  });

  app.get("/login", auth.login);
}

module.exports = router;