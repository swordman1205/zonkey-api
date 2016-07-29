var auth = require("./auth.js");
var dossier = require("./dossier.js");
var comment = require("./comment.js");
var upload = require("./upload.js");

var router = function(app) {
  app.get("/", function(req, res) {
    res.send("Welcome! This is Zonkey API.");
  });

  app.get("/login", auth.login);
  app.get("/dossiers", dossier.getAll);
  app.get("/dossier", dossier.getById);

  app.post("/comment", comment.addNew);
  app.options("/upload", upload.addNew);
}

module.exports = router;