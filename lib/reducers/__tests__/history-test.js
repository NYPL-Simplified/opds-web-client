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
var history_1 = require("../history");
var DataFetcher_1 = require("../../DataFetcher");
var actions_1 = require("../../actions");
var OPDSDataAdapter_1 = require("../../OPDSDataAdapter");
var fetcher = new DataFetcher_1.default({ adapter: OPDSDataAdapter_1.adapter });
var actions = new actions_1.default(fetcher);
var rootLink = {
    id: null,
    url: "root url",
    text: "root text"
};
var secondLink = {
    id: "second id",
    url: "second url",
    text: "second text"
};
var thirdLink = {
    id: "third id",
    url: "third url",
    text: "third text"
};
var fourthLink = {
    id: "fourth id",
    url: "fourth url",
    text: "fourth text"
};
var longHistory = [rootLink, secondLink, thirdLink];
var basicCollection = {
    id: "test id",
    url: "test url",
    title: "test title",
    books: [],
    lanes: [],
    navigationLinks: []
};
describe("shouldClear()", function () {
    it("should return true if new collection is old root", function () {
        var newCollection = __assign(__assign({}, basicCollection), { id: "root id", url: "root url", title: "root text" });
        var oldCollection = __assign(__assign({}, basicCollection), { id: "test id", url: "test url", title: "test title", catalogRootLink: rootLink });
        var clear = history_1.shouldClear(newCollection, oldCollection);
        chai_1.expect(clear).to.equal(true);
    });
    it("should return true if new collection is new root", function () {
        var newCollection = __assign(__assign({}, basicCollection), { id: "test id", url: "test url", title: "test title", catalogRootLink: {
                url: "test url",
                text: "some title"
            } });
        var clear = history_1.shouldClear(newCollection, basicCollection);
        chai_1.expect(clear).to.equal(true);
    });
    it("should return true if new root is not old root", function () {
        var newCollection = __assign(__assign({}, basicCollection), { id: "some id", url: "some url", title: "some title", catalogRootLink: {
                url: "other url",
                text: "other text"
            } });
        var oldCollection = __assign(__assign({}, basicCollection), { id: "test id", url: "test url", title: "test title", catalogRootLink: rootLink });
        var clear = history_1.shouldClear(newCollection, oldCollection);
        chai_1.expect(clear).to.equal(true);
    });
    it("should return false otherwise", function () {
        var newCollection = __assign(__assign({}, basicCollection), { id: "other id", url: "other url", title: "other title", catalogRootLink: rootLink, parentLink: thirdLink });
        var oldCollection = __assign(__assign({}, basicCollection), { id: "third id", url: "third url", title: "third title", catalogRootLink: rootLink });
        var clear = history_1.shouldClear(newCollection, oldCollection);
        chai_1.expect(clear).to.equal(false);
    });
});
describe("shorten()", function () {
    it("should shorten history if it contains new url", function () {
        var newHistory = history_1.shorten(longHistory, longHistory[2].url);
        chai_1.expect(newHistory).to.deep.equal([rootLink, secondLink]);
    });
    it("shouldn't shorten history if it doesn't contain new url", function () {
        var newHistory = history_1.shorten(longHistory, "other url");
        chai_1.expect(newHistory).to.deep.equal(longHistory);
    });
});
describe("addLink", function () {
    it("adds a link to a history", function () {
        var newHistory = history_1.addLink(longHistory, fourthLink);
        chai_1.expect(newHistory).to.deep.equal(longHistory.concat([fourthLink]));
    });
});
describe("addCollection", function () {
    it("adds a collection to a history", function () {
        var collection = basicCollection;
        var newHistory = history_1.addCollection(longHistory, collection);
        chai_1.expect(newHistory).to.deep.equal(longHistory.concat([
            {
                id: collection.id,
                url: collection.url,
                text: collection.title
            }
        ]));
    });
});
describe("history reducer", function () {
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
        var newHistory = [
            {
                id: "id",
                text: "title",
                url: "url"
            }
        ];
        chai_1.expect(history_1.default(currentState, action)).to.deep.equal(newHistory);
    });
    it("shouldn't change history on COLLECTION_LOAD with same id", function () {
        var data = {
            id: "id",
            url: "some url",
            title: "some title",
            lanes: [],
            books: [],
            navigationLinks: []
        };
        var action = actions.load(actions_1.default.COLLECTION, data, "some other url");
        chai_1.expect(history_1.default(currentState, action)).to.deep.equal(currentState.history);
    });
    it("should clear history on COLLECTION_LOAD with the old catalog root", function () {
        var stateWithHistory = __assign(__assign({}, currentState), { history: [
                {
                    id: "test id",
                    url: "test url",
                    text: "test title"
                }
            ] });
        var data = {
            id: "some id",
            url: "root url",
            title: "root title",
            lanes: [],
            books: [],
            navigationLinks: []
        };
        var action = actions.load(actions_1.default.COLLECTION, data, "root url");
        chai_1.expect(history_1.default(stateWithHistory, action)).to.deep.equal([]);
    });
    it("should clear history on COLLECTION_LOAD with a new catalog", function () {
        var stateWithHistory = __assign(__assign({}, currentState), { history: [
                {
                    id: "test id",
                    url: "test url",
                    text: "test title"
                }
            ] });
        var data = {
            id: "some id",
            url: "some url",
            title: "some title",
            catalogRootLink: {
                url: "new root url",
                text: "new root title"
            },
            lanes: [],
            books: [],
            navigationLinks: []
        };
        var action = actions.load(actions_1.default.COLLECTION, data, "some url");
        var newHistory = [
            {
                id: null,
                url: "new root url",
                text: "new root title"
            }
        ];
        chai_1.expect(history_1.default(stateWithHistory, action)).to.deep.equal(newHistory);
    });
    it("should remove history up to loaded url on COLLECTION_LOAD with url in history", function () {
        var stateWithHistory = __assign(__assign({}, currentState), { history: [
                {
                    id: "first id",
                    url: "first url",
                    text: "first title"
                },
                {
                    id: "test id",
                    url: "test url",
                    text: "test title"
                },
                {
                    id: "other id",
                    url: "other url",
                    text: "other title"
                }
            ] });
        var data = {
            id: "test id",
            url: "test url",
            title: "test title",
            catalogRootLink: {
                url: "root url"
            },
            lanes: [],
            books: [],
            navigationLinks: []
        };
        var action = actions.load(actions_1.default.COLLECTION, data, "test url");
        var newHistory = [
            {
                id: "first id",
                url: "first url",
                text: "first title"
            }
        ];
        chai_1.expect(history_1.default(stateWithHistory, action)).to.deep.equal(newHistory);
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
        chai_1.expect(history_1.default(errorState, action)).to.deep.equal([]);
    });
});
