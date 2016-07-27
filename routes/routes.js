var auth = require("./auth.js");
var dossier = require("./dossier.js");

var router = function(app) {
  app.get("/", function(req, res) {
    res.send("Welcome! This is Zonkey API.");
  });

  app.get("/login", auth.login);
  app.get("/dossiers", function(req, res) {
    res.send("Welcome! This is Zonkey API.");
  });
}

module.exports = router;