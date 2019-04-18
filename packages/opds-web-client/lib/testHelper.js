"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
var doc = jsdom_1.jsdom("<!doctype html><html><body></body></html>");
var win = doc.defaultView;
global["document"] = doc;
global["window"] = win;
Object.keys(window).forEach(function (key) {
    if (!(key in global)) {
        global[key] = window[key];
    }
});
// Ignore imported stylesheets.
var noop = function () { };
require.extensions[".scss"] = noop;
