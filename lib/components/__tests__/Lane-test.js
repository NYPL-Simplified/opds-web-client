"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var PropTypes = require("prop-types");
var enzyme_1 = require("enzyme");
var Lane_1 = require("../Lane");
var Book_1 = require("../Book");
var CatalogLink_1 = require("../CatalogLink");
var LaneMoreLink_1 = require("../LaneMoreLink");
var routing_1 = require("../../__mocks__/routing");
var books = [1, 2, 3].map(function (i) {
    return {
        id: "test book id " + i,
        title: "test book title " + i,
        authors: ["test author " + i],
        summary: "test summary " + i,
        imageUrl: "https://example.com/testimage" + i,
        publisher: "test publisher " + i
    };
});
var laneData = {
    title: "test lane",
    books: books,
    url: "http://example.com/testlane"
};
describe("Lane", function () {
    var wrapper;
    var updateBook;
    var fulfillBook;
    var indirectFulfillBook;
    beforeEach(function () {
        updateBook = sinon_1.stub();
        fulfillBook = sinon_1.stub();
        indirectFulfillBook = sinon_1.stub();
    });
    describe("rendering", function () {
        beforeEach(function () {
            wrapper = enzyme_1.shallow(React.createElement(Lane_1.default, { lane: laneData, collectionUrl: "test collection", updateBook: updateBook }));
        });
        it("shows the lane title in a CatalogLink", function () {
            var titleLink = wrapper.find(CatalogLink_1.default);
            chai_1.expect(titleLink
                .first()
                .children()
                .text()).to.equal(laneData.title);
        });
        it("shows Books", function () {
            var bookComponents = wrapper.find(Book_1.default);
            var bookDatas = bookComponents.map(function (book) { return book.props().book; });
            var uniqueCollectionUrls = Array.from(new Set(bookComponents.map(function (book) { return book.props().collectionUrl; })));
            chai_1.expect(bookComponents.length).to.equal(books.length);
            chai_1.expect(bookDatas).to.deep.equal(books);
            chai_1.expect(uniqueCollectionUrls).to.deep.equal(["test collection"]);
        });
        it("shows more link", function () {
            var moreLink = wrapper.find(LaneMoreLink_1.default);
            chai_1.expect(moreLink.prop("lane")).to.equal(laneData);
        });
        it("hides more link", function () {
            wrapper.setProps({ hideMoreLink: true });
            var moreLink = wrapper.find(LaneMoreLink_1.default);
            chai_1.expect(moreLink.length).to.equal(0);
        });
        it("hides books by id", function () {
            wrapper.setProps({ hiddenBookIds: ["test book id 1"] });
            var bookComponents = wrapper.find(Book_1.default);
            chai_1.expect(bookComponents.length).to.equal(books.length - 1);
            chai_1.expect(bookComponents.at(0).props().book).to.equal(books[1]);
        });
        it("shows left scroll button when it's not all the way left", function () {
            wrapper.setState({ atLeft: false });
            var button = wrapper.find(".scroll-button.left");
            chai_1.expect(button.length).to.equal(1);
        });
        it("hides left scroll button when it is all the way left", function () {
            wrapper.setState({ atLeft: true });
            var button = wrapper.find(".scroll-button.left");
            chai_1.expect(button.length).to.equal(0);
        });
        it("shows right scroll button when it's not all the way right", function () {
            wrapper.setState({ atRight: false });
            var button = wrapper.find(".scroll-button.right");
            chai_1.expect(button.length).to.equal(1);
        });
        it("hides right scroll button when it is all the way right", function () {
            wrapper.setState({ atRight: true });
            var button = wrapper.find(".scroll-button.right");
            chai_1.expect(button.length).to.equal(0);
        });
    });
    describe("behavior", function () {
        beforeEach(function () {
            window.requestAnimationFrame = function (f) {
                f(0);
                return 1;
            };
            window.cancelAnimationFrame = sinon_1.stub();
            var context = routing_1.mockRouterContext();
            wrapper = enzyme_1.mount(React.createElement(Lane_1.default, { lane: laneData, collectionUrl: "test collection", updateBook: updateBook }), {
                context: context,
                childContextTypes: {
                    router: PropTypes.object,
                    pathFor: PropTypes.func
                }
            });
        });
        it("scrolls back", function () {
            wrapper.setState({ atLeft: false, atRight: true });
            wrapper.instance().getContainerWidth = function () { return 200; };
            wrapper.instance().getScrollWidth = function () { return 1000; };
            var list = wrapper.instance().refs["list"];
            list.scrollLeft = 800;
            var button = wrapper.find(".scroll-button.left");
            button.simulate("click");
            chai_1.expect(wrapper.instance().getScroll()).to.equal(650);
            wrapper.instance().updateScrollButtons();
            chai_1.expect(wrapper.state().atLeft).to.be.false;
            chai_1.expect(wrapper.state().atRight).to.be.false;
        });
        it("stops at left edge when scrolling back", function () {
            wrapper.setState({ atLeft: false, atRight: true });
            wrapper.instance().getContainerWidth = function () { return 200; };
            wrapper.instance().getScrollWidth = function () { return 1000; };
            var list = wrapper.instance().refs["list"];
            list.scrollLeft = 100;
            var button = wrapper.find(".scroll-button.left");
            button.simulate("click");
            chai_1.expect(wrapper.instance().getScroll()).to.equal(0);
            wrapper.instance().updateScrollButtons();
            chai_1.expect(wrapper.state().atLeft).to.be.true;
            chai_1.expect(wrapper.state().atRight).to.be.false;
        });
        it("scrolls forward", function () {
            wrapper.setState({ atLeft: true, atRight: false });
            wrapper.instance().getContainerWidth = function () { return 200; };
            wrapper.instance().getScrollWidth = function () { return 1000; };
            var list = wrapper.instance().refs["list"];
            list.scrollLeft = 0;
            var button = wrapper.find(".scroll-button.right");
            button.simulate("click");
            chai_1.expect(wrapper.instance().getScroll()).to.equal(150);
            wrapper.instance().updateScrollButtons();
            chai_1.expect(wrapper.state().atLeft).to.be.false;
            chai_1.expect(wrapper.state().atRight).to.be.false;
        });
        it("stops at right edge when scrolling forward", function () {
            wrapper.setState({ atLeft: true, atRight: false });
            wrapper.instance().getContainerWidth = function () { return 200; };
            wrapper.instance().getScrollWidth = function () { return 1000; };
            var list = wrapper.instance().refs["list"];
            list.scrollLeft = 700;
            var button = wrapper.find(".scroll-button.right");
            button.simulate("click");
            chai_1.expect(wrapper.instance().getScroll()).to.equal(800);
            wrapper.instance().updateScrollButtons();
            chai_1.expect(wrapper.state().atLeft).to.be.false;
            chai_1.expect(wrapper.state().atRight).to.be.true;
        });
    });
});
