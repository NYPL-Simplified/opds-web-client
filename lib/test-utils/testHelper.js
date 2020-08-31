"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
var enzyme_1 = require("enzyme");
var Adapter = require("enzyme-adapter-react-16");
enzyme_1.configure({ adapter: new Adapter() });
var jsdom = new jsdom_1.JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost"
});
var window = jsdom.window;
function copyProps(src, target) {
    Object.defineProperties(target, __assign(__assign({}, Object.getOwnPropertyDescriptors(src)), Object.getOwnPropertyDescriptors(target)));
}
global["window"] = window;
global["document"] = window.document;
global["navigator"] = {
    userAgent: "node.js"
};
global["requestAnimationFrame"] = function (callback) {
    return setTimeout(callback, 0);
};
global["cancelAnimationFrame"] = function (id) {
    clearTimeout(id);
};
copyProps(window, global);
// Ignore imported stylesheets.
var noop = function () { };
require.extensions[".scss"] = noop;
