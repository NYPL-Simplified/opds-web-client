"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var enzyme_1 = require("enzyme");
var ErrorMessage_1 = require("../ErrorMessage");
describe("ErrorMessage", function () {
    it("shows the message", function () {
        var wrapper = enzyme_1.shallow(React.createElement(ErrorMessage_1.default, { message: "test error" }));
        var message = wrapper.find(".message");
        chai_1.expect(message.text()).to.equal("test error");
    });
    it("retries", function () {
        var retry = sinon_1.stub();
        var wrapper = enzyme_1.shallow(React.createElement(ErrorMessage_1.default, { message: "test error", retry: retry }));
        var button = wrapper.find(".retry-button");
        button.simulate("click");
        chai_1.expect(retry.callCount).to.equal(1);
    });
    it("closes", function () {
        var close = sinon_1.stub();
        var wrapper = enzyme_1.shallow(React.createElement(ErrorMessage_1.default, { message: "test error", close: close }));
        var button = wrapper.find(".close-button");
        button.simulate("click");
        chai_1.expect(close.callCount).to.equal(1);
    });
    it("uses bootstrap classes", function () {
        var wrapper = enzyme_1.shallow(React.createElement(ErrorMessage_1.default, { message: "test error", retry: sinon_1.stub() }));
        var buttons = wrapper.find(".btn");
        chai_1.expect(buttons.length).to.equal(1);
    });
});
