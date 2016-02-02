var express = require('express');
var request = require("request");
var app = express();
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(__dirname + "/public"));

app.listen(port, function() {
  console.log("Server listening on port " + port);
});

app.post("/proxy", function(req, res) {
  request.get(req.body.url).pipe(res);
});