"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var book_1 = require("../book");
var DataFetcher_1 = require("../../DataFetcher");
var actions_1 = require("../../actions");
var OPDSDataAdapter_1 = require("../../OPDSDataAdapter");
var fetcher = new DataFetcher_1.default({ adapter: OPDSDataAdapter_1.adapter });
var actions = new actions_1.default(fetcher);
describe("book reducer", function () {
    var book = {
        id: "test id",
        url: "test url",
        title: "test title",
        authors: ["test author"],
        summary: "test summary",
        imageUrl: "http://example.com/testthumb.jpg",
        published: "test date",
        publisher: "test publisher"
    };
    var initState = {
        url: null,
        data: null,
        isFetching: false,
        error: null
    };
    var bookState = {
        url: book.url,
        data: book,
        isFetching: false,
        error: null
    };
    var fetchingState = {
        url: book.url,
        data: book,
        isFetching: true,
        error: null
    };
    var errorState = {
        url: null,
        data: null,
        isFetching: false,
        error: {
            status: 500,
            response: "error",
            url: "url",
        }
    };
    it("should return the initial state", function () {
        chai_1.expect(book_1.default(undefined, {})).to.deep.equal(initState);
    });
    it("should handle BOOK_REQUEST", function () {
        var action = actions.request(actions_1.default.BOOK, "some other url");
        var newState = Object.assign({}, errorState, {
            isFetching: true,
            error: null
        });
        chai_1.expect(book_1.default(errorState, action)).to.deep.equal(newState);
    });
    it("should handle BOOK_FAILURE", function () {
        var action = actions.failure(actions_1.default.BOOK, {
            status: 500,
            response: "test error",
            url: "error url"
        });
        var newState = Object.assign({}, fetchingState, {
            isFetching: false,
            error: {
                status: 500,
                response: "test error",
                url: "error url"
            }
        });
        chai_1.expect(book_1.default(fetchingState, action)).to.deep.equal(newState);
    });
    it("should handle BOOK_LOAD", function () {
        var data = {
            id: "some id",
            title: "some title"
        };
        var action = actions.load(actions_1.default.BOOK, data, "some other url");
        var newState = Object.assign({}, bookState, {
            url: "some other url",
            data: data,
            isFetching: false
        });
        chai_1.expect(book_1.default(bookState, action)).to.deep.equal(newState);
    });
    it("should handle BOOK_CLEAR", function () {
        var action = actions.clear(actions_1.default.BOOK);
        var newState = Object.assign({}, bookState, {
            url: null,
            data: null
        });
        chai_1.expect(book_1.default(bookState, action)).to.deep.equal(newState);
    });
    it("should preserve empty state on UPDATE_BOOK_LOAD", function () {
        var action = actions.load(actions_1.default.UPDATE_BOOK, book, "url");
        chai_1.expect(book_1.default(initState, action)).to.deep.equal(initState);
    });
    it("should update book in state on UPDATE_BOOK_LOAD", function () {
        var newBook = Object.assign({}, book, { title: "new title" });
        var action = actions.load(actions_1.default.UPDATE_BOOK, newBook, "url");
        var newState = Object.assign({}, bookState, { data: newBook });
        chai_1.expect(book_1.default(bookState, action)).to.deep.equal(newState);
    });
});
