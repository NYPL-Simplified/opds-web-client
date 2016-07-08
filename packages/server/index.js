var express = require('express');
var request = require("request");
var app = express();
var port = process.env.PORT || 3000;

var multer  = require('multer');
var form = multer();

app.use(express.static(__dirname + "/node_modules/opds-web-client/dist"));
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

app.get("/*", function(req, res, next) {
  res.render("index.html.ejs");
});