"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var React = require("react");
var enzyme_1 = require("enzyme");
var LaneMoreLink_1 = require("../LaneMoreLink");
var CatalogLink_1 = require("../CatalogLink");
var bookData = {
    id: "test id",
    url: "test url",
    title: "test title",
    authors: ["test author"],
    summary: "test summary",
    imageUrl: "https://example.com/testimage",
    publisher: "test publisher"
};
var laneData = {
    title: "test lane",
    books: [bookData],
    url: "http://example.com/testlane"
};
describe("LaneMoreLink", function () {
    var wrapper;
    beforeEach(function () {
        wrapper = enzyme_1.shallow(React.createElement(LaneMoreLink_1.default, { lane: laneData }));
    });
    it("shows CatalogLink pointing to lane url", function () {
        var link = wrapper.find(CatalogLink_1.default);
        chai_1.expect(link.prop("collectionUrl")).to.equal(laneData.url);
        chai_1.expect(link.children().text()).to.equal("More" + laneData.title); // text() ignores line break
    });
});
