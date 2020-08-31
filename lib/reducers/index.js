"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var collection_1 = require("./collection");
var book_1 = require("./book");
var auth_1 = require("./auth");
var loans_1 = require("./loans");
var preferences_1 = require("./preferences");
var reducers = redux_1.combineReducers({
    collection: collection_1.default,
    book: book_1.default,
    loans: loans_1.default,
    auth: auth_1.default,
    preferences: preferences_1.default
});
exports.default = reducers;
