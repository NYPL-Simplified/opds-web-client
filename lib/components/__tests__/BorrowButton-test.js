"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var enzyme_1 = require("enzyme");
var BorrowButton_1 = require("../BorrowButton");
var collectionData_1 = require("./collectionData");
describe("BorrowButton", function () {
    var wrapper;
    var borrow;
    var style;
    var bookData = collectionData_1.ungroupedCollectionData.books[0];
    bookData.borrowUrl = "borrow url";
    beforeEach(function () {
        borrow = sinon_1.stub().returns(new Promise(function (resolve, reject) {
            return resolve({ blob: "blob", mimeType: "mime/type" });
        }));
        style = { border: "100px solid black" };
        wrapper = enzyme_1.shallow(React.createElement(BorrowButton_1.default, { style: style, borrow: borrow }, "Borrow"));
    });
    it("shows button", function () {
        var button = wrapper.find("button");
        chai_1.expect(button.props().style).to.deep.equal(style);
        chai_1.expect(button.text()).to.equal("Borrow");
    });
    it("borrows when clicked", function () {
        var button = wrapper.find("button");
        button.simulate("click");
        chai_1.expect(borrow.callCount).to.equal(1);
    });
});
