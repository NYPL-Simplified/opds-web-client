"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sinon_1 = require("sinon");
exports.mockRouter = function (push) {
    return {
        push: push,
        createHref: function (location) { return "test href"; },
        isActive: function (location, onlyActiveOnIndex) { return true; }
    };
};
exports.mockRouterContext = function (push, pathFor) {
    return {
        router: exports.mockRouter(push || sinon_1.stub()),
        pathFor: pathFor || (function (collectionUrl, bookUrl) { return collectionUrl + "::" + bookUrl; })
    };
};
