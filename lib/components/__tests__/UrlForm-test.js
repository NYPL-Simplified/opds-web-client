"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var enzyme_1 = require("enzyme");
var UrlForm_1 = require("../UrlForm");
var routing_1 = require("../../__mocks__/routing");
describe("UrlForm", function () {
    it("shows the form with bootstrap classes", function () {
        var context = routing_1.mockRouterContext();
        var wrapper = enzyme_1.shallow(React.createElement(UrlForm_1.default, null), { context: context });
        var form = wrapper.find("form");
        var input = wrapper.find("input");
        var button = wrapper.find("button");
        chai_1.expect(form.hasClass("form-inline")).to.equal(true);
        chai_1.expect(input.hasClass("form-control")).to.equal(true);
        chai_1.expect(button.hasClass("btn")).to.equal(true);
    });
    it("fetches the url", function () {
        var push = sinon_1.stub();
        var context = routing_1.mockRouterContext(push);
        var wrapper = enzyme_1.mount(React.createElement(UrlForm_1.default, null), { context: context });
        var form = wrapper.find("form");
        var input = wrapper.find("input").getDOMNode();
        input.value = "some url";
        form.simulate("submit");
        chai_1.expect(push.callCount).to.equal(1);
        chai_1.expect(push.args[0][0]).to.equal(context.pathFor("some url", null));
    });
    it("should render a label ", function () {
        var context = routing_1.mockRouterContext();
        var wrapper = enzyme_1.mount(React.createElement(UrlForm_1.default, null), { context: context });
        var label = wrapper.find("label");
        chai_1.expect(label.length).to.equal(1);
        chai_1.expect(label.prop("htmlFor")).to.equal("opds-input");
    });
});
