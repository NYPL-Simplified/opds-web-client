var express = require("express");
var request = require("request");
var app = express();
var port = process.env.PORT || 3000;

var multer = require("multer");
var form = multer();

var serverManifestJson = require("r2-streamer-js/dist/src/server-manifestjson")
  .serverManifestJson;
var serverMediaOverlays = require("r2-streamer-js/dist/src/server-mediaoverlays")
  .serverMediaOverlays;
var serverPub = require("r2-streamer-js/dist/src/server-pub").serverPub;
var serverAssets = require("r2-streamer-js/dist/src/server-assets")
  .serverAssets;
var Server = require("r2-streamer-js/dist/src/server").Server;

app.use(express.static(__dirname + "/../opds-web-client/dist"));
// Uncomment to enable the webreader when `nypl-simplified-webpub-viewer` is installed.
// app.use(express.static(__dirname + "/node_modules/nypl-simplified-webpub-viewer/dist"));
app.use(express.static(__dirname + "/node_modules/whatwg-fetch"));
app.use(express.static(__dirname + "/node_modules/promise-polyfill"));
app.use(express.static(__dirname + "/node_modules/requirejs"));
app.use(express.static(__dirname + "/node_modules/url-polyfill"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.listen(port, function() {
  console.log("Server listening on port " + port);
});

class RemoteEpubServer {
  constructor() {
    this.publications = [];
    this.pathPublicationMap = {};
    var router = serverPub(this, app);
    serverManifestJson(this, router);
    serverAssets(this, router);
    serverMediaOverlays(this, router);
  }

  addPublications(pubs) {
    Server.prototype.addPublications.call(this, pubs);
  }
  isPublicationCached(filePath) {
    Server.prototype.isPublicationCached.call(this, filePath);
  }
  cachedPublication(filePath) {
    Server.prototype.cachedPublication.call(this, filePath);
  }
  cachePublication(filePath, pub) {
    Server.prototype.cachePublication.call(this, filePath, pub);
  }
}

var streamer = new RemoteEpubServer();

app.post("/proxy", form.array(), function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  var options = {
    uri: req.body.url,
    headers: {
      Authorization: req.headers.authorization,
      "X-Requested-With": req.headers["x-requested-with"]
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
  res.setHeader(
    "Access-Control-Allow-Methods",
    req.headers["access-control-request-method"]
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"]
  );
  res.status(200).end();
});

app.get("/reader", function(req, res, next) {
  res.render("reader.html.ejs");
});

app.get("/*", function(req, res, next) {
  res.render("index.html.ejs");
});
