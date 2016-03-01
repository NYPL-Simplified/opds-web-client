var express = require('express');
var request = require("request");
var app = express();
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(__dirname + "/node_modules/opds-browser/lib"));
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

app.listen(port, function() {
  console.log("Server listening on port " + port);
});

app.get("/", function(req, res, next) {
  res.render("index.html.ejs");
});

app.post("/proxy", function(req, res, next) {
  var options = {
    uri: req.body.url,
    headers: {
      "Authorization": req.headers.authorization
    }
  };
  request
    .get(options)
    .on("error", function(err) {
      next("proxy request error: " + req.body.url + " " + err);
    })
    .pipe(res);
});