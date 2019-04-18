"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var history = require("../history");
var collection_1 = require("../collection");
var DataFetcher_1 = require("../../DataFetcher");
var actions_1 = require("../../actions");
var OPDSDataAdapter_1 = require("../../OPDSDataAdapter");
var fetcher = new DataFetcher_1.default({ adapter: OPDSDataAdapter_1.adapter });
var actions = new actions_1.default(fetcher);
describe("collection reducer", function () {
    var initState = {
        url: null,
        data: null,
        isFetching: false,
        isFetchingPage: false,
        error: null,
        history: []
    };
    var currentState = {
        url: "some url",
        data: {
            id: "id",
            title: "title",
            url: "url",
            lanes: [],
            books: [],
            navigationLinks: [],
            catalogRootLink: {
                url: "root url",
                text: "root title"
            },
            parentLink: {
                url: "parent url",
                text: "parent title"
            }
        },
        isFetching: false,
        isFetchingPage: false,
        error: null,
        history: []
    };
    var fetchingState = {
        url: "some url",
        data: null,
        isFetching: true,
        isFetchingPage: false,
        error: null,
        history: []
    };
    var fetchingPageState = {
        url: "some url",
        data: {
            id: "id",
            url: "some url",
            title: "some title",
            books: [],
            lanes: [],
            navigationLinks: []
        },
        isFetching: false,
        isFetchingPage: true,
        error: null,
        history: []
    };
    var errorState = {
        url: null,
        data: null,
        isFetching: false,
        isFetchingPage: false,
        error: {
            status: 500,
            response: "test error",
            url: "some url"
        },
        history: []
    };
    var historyStub;
    beforeEach(function () {
        historyStub = sinon_1.stub(history, "default").callsFake(function (state, action) { return state.history; });
    });
    afterEach(function () {
        historyStub.restore();
    });
    it("should return the initial state", function () {
        chai_1.expect(collection_1.default(undefined, {})).to.deep.equal(initState);
    });
    it("should handle COLLECTION_REQUEST", function () {
        var action = actions.request(actions_1.default.COLLECTION, "some other url");
        var newState = Object.assign({}, errorState, {
            isFetching: true,
            error: null
        });
        chai_1.expect(collection_1.default(errorState, action)).to.deep.equal(newState);
    });
    it("should handle COLLECTION_FAILURE", function () {
        var action = actions.failure(actions_1.default.COLLECTION, {
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
        chai_1.expect(collection_1.default(fetchingState, action)).to.deep.equal(newState);
    });
    it("should handle COLLECTION_LOAD", function () {
        var data = {
            id: "some id",
            url: "some url",
            title: "some title",
            lanes: [],
            books: [],
            navigationLinks: []
        };
        var action = actions.load(actions_1.default.COLLECTION, data, "some other url");
        var newState = Object.assign({}, currentState, {
            url: "some other url",
            data: data,
            isFetching: false
        });
        chai_1.expect(collection_1.default(currentState, action)).to.deep.equal(newState);
    });
    it("should handle COLLECTION_LOAD after an error", function () {
        var data = {
            id: "some id",
            url: "some url",
            title: "some title",
            lanes: [],
            books: [],
            navigationLinks: []
        };
        var action = actions.load(actions_1.default.COLLECTION, data, "some url");
        var newState = Object.assign({}, errorState, {
            url: "some url",
            data: data,
            isFetching: false,
            error: null
        });
        chai_1.expect(collection_1.default(errorState, action)).to.deep.equal(newState);
    });
    it("should handle COLLECTION_CLEAR", function () {
        var action = actions.clear(actions_1.default.COLLECTION);
        var newState = Object.assign({}, currentState, {
            url: null,
            data: null
        });
        chai_1.expect(collection_1.default(currentState, action)).to.deep.equal(newState);
    });
    it("should handle PAGE_REQUEST", function () {
        var action = actions.request(actions_1.default.PAGE, "some other url");
        var newState = Object.assign({}, currentState, {
            pageUrl: "some other url",
            isFetchingPage: true
        });
        chai_1.expect(collection_1.default(currentState, action)).to.deep.equal(newState);
    });
    it("should handle PAGE_FAILURE", function () {
        var action = actions.failure(actions_1.default.PAGE, {
            status: 500,
            response: "test error",
            url: "error url"
        });
        var newState = Object.assign({}, fetchingPageState, {
            isFetchingPage: false,
            error: {
                status: 500,
                response: "test error",
                url: "error url"
            }
        });
        chai_1.expect(collection_1.default(fetchingPageState, action)).to.deep.equal(newState);
    });
    it("should handle PAGE_LOAD", function () {
        var data = {
            id: "some id",
            url: "test url",
            title: "some title",
            lanes: [],
            books: [{
                    id: "new book",
                    title: "new title",
                    authors: [],
                    summary: "new summary",
                    imageUrl: "",
                    publisher: ""
                }],
            navigationLinks: [],
            nextPageUrl: "next"
        };
        var action = actions.load(actions_1.default.PAGE, data);
        var newState = Object.assign({}, fetchingPageState, {
            data: Object.assign({}, fetchingPageState.data, {
                books: data.books,
                nextPageUrl: "next"
            }),
            isFetchingPage: false
        });
        chai_1.expect(collection_1.default(fetchingPageState, action)).to.deep.equal(newState);
    });
    it("should handle SEARCH_DESCRIPTION_LOAD", function () {
        var searchData = {
            description: "d",
            shortName: "s",
            template: function (s) { return s + " template"; }
        };
        var action = actions.load(actions_1.default.SEARCH_DESCRIPTION, { searchData: searchData });
        var newState = collection_1.default(currentState, action);
        chai_1.expect(newState.data.search).to.be.ok;
        chai_1.expect(newState.data.search.searchData.description).to.equal("d");
        chai_1.expect(newState.data.search.searchData.shortName).to.equal("s");
        chai_1.expect(newState.data.search.searchData.template("test")).to.equal("test template");
    });
    it("should handle CLOSE_ERROR", function () {
        var action = actions.closeError();
        var newState = Object.assign({}, errorState, {
            error: null
        });
        chai_1.expect(collection_1.default(errorState, action)).to.deep.equal(newState);
    });
});
