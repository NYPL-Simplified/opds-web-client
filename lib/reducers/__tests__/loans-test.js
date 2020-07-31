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
var chai_1 = require("chai");
var loans_1 = require("../loans");
var DataFetcher_1 = require("../../DataFetcher");
var actions_1 = require("../../actions");
var OPDSDataAdapter_1 = require("../../OPDSDataAdapter");
var fetcher = new DataFetcher_1.default({ adapter: OPDSDataAdapter_1.adapter });
var actions = new actions_1.default(fetcher);
var collectionData = {
    url: "collection url",
    title: "title",
    id: "id",
    books: [],
    lanes: [],
    navigationLinks: [],
    shelfUrl: "loans url"
};
var loansData = {
    url: "collection url",
    title: "title",
    id: "id",
    books: [
        {
            id: "book id",
            url: "book url",
            title: "book title"
        }
    ],
    lanes: [],
    navigationLinks: []
};
describe("loans reducer", function () {
    var initState = {
        url: null,
        books: []
    };
    it("returns the initial state", function () {
        chai_1.expect(loans_1.default(undefined, {})).to.deep.equal(initState);
    });
    it("handles COLLECTION_LOAD", function () {
        var action = actions.load(actions_1.default.COLLECTION, collectionData);
        var newState = __assign(__assign({}, initState), { url: "loans url" });
        chai_1.expect(loans_1.default(initState, action)).to.deep.equal(newState);
    });
    it("handles COLLECTION_LOAD for loans feed", function () {
        var oldState = __assign(__assign({}, initState), { url: "loans url" });
        var loansCollectionData = __assign(__assign({}, collectionData), { books: loansData.books });
        var action = actions.load(actions_1.default.COLLECTION, loansCollectionData, "loans url");
        var newState = __assign(__assign({}, oldState), { books: loansData.books });
        chai_1.expect(loans_1.default(oldState, action)).to.deep.equal(newState);
    });
    it("handles LOANS_LOAD", function () {
        var oldState = __assign(__assign({}, initState), { url: "loans url" });
        var action = actions.load(actions_1.default.LOANS, loansData);
        var newState = __assign(__assign({}, oldState), { books: loansData.books });
        chai_1.expect(loans_1.default(oldState, action)).to.deep.equal(newState);
    });
    it("clears books on CLEAR_AUTH_CREDENTIALS", function () {
        var oldState = __assign(__assign({}, initState), { books: loansData.books });
        var action = actions.clearAuthCredentials();
        var newState = __assign(__assign({}, oldState), { books: [] });
        chai_1.expect(loans_1.default(oldState, action)).to.deep.equal(newState);
    });
    it("removes book that's no longer borrowed on UPDATE_BOOK_LOAD", function () {
        var oldState = __assign(__assign({}, initState), { books: loansData.books });
        var newBookData = {
            id: "book id",
            url: "book url",
            title: "new book title"
        };
        var action = actions.load(actions_1.default.UPDATE_BOOK, newBookData);
        var newState = __assign(__assign({}, oldState), { books: [] });
        chai_1.expect(loans_1.default(oldState, action)).to.deep.equal(newState);
    });
    it("adds newly borrowed book on UPDATE_BOOK_LOAD", function () {
        var oldState = __assign(__assign({}, initState), { books: loansData.books });
        var newBookData = {
            id: "new book id",
            url: "new book url",
            title: "new book title",
            fulfillmentLinks: [
                { url: "url", type: "application/pdf", indirectType: "" }
            ]
        };
        var action = actions.load(actions_1.default.UPDATE_BOOK, newBookData);
        var newState = __assign(__assign({}, oldState), { books: [loansData.books[0], newBookData] });
        chai_1.expect(loans_1.default(oldState, action)).to.deep.equal(newState);
    });
    it("adds newly reserved book on UPDATE_BOOK_LOAD", function () {
        var oldState = __assign(__assign({}, initState), { books: loansData.books });
        var newBookData = {
            id: "new book id",
            url: "new book url",
            title: "new book title",
            availability: { status: "reserved" }
        };
        var action = actions.load(actions_1.default.UPDATE_BOOK, newBookData);
        var newState = __assign(__assign({}, oldState), { books: [loansData.books[0], newBookData] });
        chai_1.expect(loans_1.default(oldState, action)).to.deep.equal(newState);
    });
});
