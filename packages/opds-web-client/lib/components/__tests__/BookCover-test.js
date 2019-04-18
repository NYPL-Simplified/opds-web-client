"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var React = require("react");
var enzyme_1 = require("enzyme");
var BookCover_1 = require("../BookCover");
describe("BookCover", function () {
    describe("with no image url", function () {
        var wrapper;
        var bookData = {
            id: "test id",
            title: "test book",
            authors: ["paperback writer", "brilliant recluse"]
        };
        beforeEach(function () {
            wrapper = enzyme_1.shallow(React.createElement(BookCover_1.default, { book: bookData }));
        });
        it("shows title and authors", function () {
            var title = wrapper.childAt(0);
            chai_1.expect(title.text()).to.equal(bookData.title);
            var authors = wrapper.childAt(1);
            chai_1.expect(authors.text()).to.equal("By " + bookData.authors.join(", "));
        });
    });
    describe("with image url", function () {
        var wrapper;
        var bookData = {
            id: "test id",
            title: "test book",
            authors: ["paperback writer", "brilliant recluse"],
            imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg"
        };
        beforeEach(function () {
            wrapper = enzyme_1.shallow(React.createElement(BookCover_1.default, { book: bookData }));
        });
        it("shows the book cover with empty alt", function () {
            var image = wrapper.find("img");
            chai_1.expect(image.props().src).to.equal(bookData.imageUrl);
            chai_1.expect(image.props().alt).to.equal("");
        });
        it("shows the placeholder cover on image error", function () {
            var image = wrapper.find("img");
            image.simulate("error");
            var title = wrapper.childAt(0);
            chai_1.expect(title.text()).to.equal(bookData.title);
            var authors = wrapper.childAt(1);
            chai_1.expect(authors.text()).to.equal("By " + bookData.authors.join(", "));
            // The placeholder is cleared when there are new props.
            var newBookData = {
                id: "new book",
                imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/abcdefg/cover.jpg"
            };
            wrapper.setProps({ book: newBookData });
            image = wrapper.find("img");
            chai_1.expect(image.props().src).to.equal(newBookData.imageUrl);
        });
    });
});
