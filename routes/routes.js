var auth = require("./auth.js");
var dossier = require("./dossier.js");
var comment = require("./comment.js");
var upload = require("./upload.js");

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
  	console.log(file);
    cb(null, new Date().toString + ".png");
  }
});
var uploadEngine = multer({ storage: storage });

var router = function(app) {
  app.get("/", function(req, res) {
    res.send("Welcome! This is Zonkey API.");
  });

  app.get("/login", auth.login);
  app.get("/dossiers", dossier.getAll);
  app.get("/dossier", dossier.getById);

  app.post("/comment", comment.addNew);
  app.post("/upload", uploadEngine.single('file'), upload.addNew);
}

module.exports = router;