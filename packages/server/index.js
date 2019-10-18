var express = require('express');
var request = require("request");
var app = express();
var port = process.env.PORT || 3000;

var multer  = require('multer');
var form = multer();

app.use(express.static(__dirname + "/../opds-web-client/dist"));
// The following files are needed for /reader which calls /viewer for
// the required files.
app.use("/viewer", express.static(__dirname + "/node_modules/nypl-simplified-webpub-viewer/dist"));
// The /dist folder for the webpub viewer does not contain requirejs.
app.use("/viewer", express.static(__dirname + "/node_modules/requirejs"));
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

app.listen(port, function() {
  console.log("Server listening on port " + port);
});

app.post("/proxy", form.array(), function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  var options = {
    uri: req.body.url,
    headers: {
      "Authorization": req.headers.authorization,
      "X-Requested-With": req.headers["x-requested-with"],
    }
  };

  request
    .get(options)
    .on("error", function(err) {
      next("proxy request error: " + req.body.url + " " + err);
    })
    .pipe(res);
});

// support CORS preflight requests
app.options("/proxy", function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", req.headers["access-control-request-method"]);
  res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"]);
  res.status(200).end();
});

app.get("/reader", function (req, res, next) {
  res.render("reader.html.ejs");
});

app.get("/*", function(req, res, next) {
  res.render("index.html.ejs");
});
