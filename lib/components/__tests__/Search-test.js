"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var enzyme_1 = require("enzyme");
var Search_1 = require("../Search");
var routing_1 = require("../../__mocks__/routing");
describe("Search", function () {
    it("fetches the search description", function () {
        var fetchSearchDescription = sinon_1.stub();
        var url = "test url";
        var context = routing_1.mockRouterContext();
        var search = enzyme_1.shallow(React.createElement(Search_1.default, { url: url, fetchSearchDescription: fetchSearchDescription }), { context: context });
        chai_1.expect(fetchSearchDescription.callCount).to.equal(1);
        chai_1.expect(fetchSearchDescription.args[0][0]).to.equal("test url");
    });
    it("does not fetch the search description again if url doesn't change", function () {
        var fetchSearchDescription = sinon_1.stub();
        var url = "test url";
        var searchData = {
            description: "description",
            shortName: "shortName",
            template: function (s) { return s; }
        };
        var context = routing_1.mockRouterContext();
        var wrapper = enzyme_1.shallow(React.createElement(Search_1.default, { url: url, fetchSearchDescription: fetchSearchDescription }), { context: context });
        wrapper.setProps({ url: url, searchData: searchData });
        chai_1.expect(fetchSearchDescription.callCount).to.equal(1);
    });
    it("should have an aria-label for the input", function () {
        var fetchSearchDescription = sinon_1.stub();
        var searchData = {
            description: "description",
            shortName: "shortName",
            template: function (s) { return s; }
        };
        var context = routing_1.mockRouterContext();
        var wrapper = enzyme_1.shallow(React.createElement(Search_1.default, { searchData: searchData, fetchSearchDescription: fetchSearchDescription }), { context: context });
        var input = wrapper.find("input");
        chai_1.expect(input.length).to.equal(1);
        chai_1.expect(input.prop("aria-label")).to.equal("Enter search keyword or keywords");
    });
    it("shows the search form with bootstrap classes", function () {
        var searchData = {
            description: "description",
            shortName: "shortName",
            template: function (s) { return s; }
        };
        var context = routing_1.mockRouterContext();
        var wrapper = enzyme_1.shallow(React.createElement(Search_1.default, { searchData: searchData }), { context: context });
        var form = wrapper.find("form");
        var input = wrapper.find("input");
        var button = wrapper.find("button");
        chai_1.expect(form.hasClass("form-inline")).to.equal(true);
        chai_1.expect(input).to.be.ok;
        chai_1.expect(input.props().placeholder).to.equal("shortName");
        chai_1.expect(input.hasClass("form-control")).to.equal(true);
        chai_1.expect(button).to.be.ok;
        chai_1.expect(button.hasClass("btn")).to.equal(true);
    });
    it("fetches the search feed", function () {
        var searchData = {
            description: "description",
            shortName: "shortName",
            template: function (s) { return s + " template"; }
        };
        var push = sinon_1.stub();
        var context = routing_1.mockRouterContext(push);
        var wrapper = enzyme_1.mount(React.createElement(Search_1.default, { searchData: searchData }), { context: context });
        var form = wrapper.find("form").first();
        chai_1.expect(form).to.be.ok;
        var input = wrapper.find("input").getDOMNode();
        input.value = "test";
        form.simulate("submit");
        chai_1.expect(push.callCount).to.equal(1);
        chai_1.expect(push.args[0][0]).to.equal(context.pathFor("test template", null));
    });
    it("escapes search terms", function () {
        var searchData = {
            description: "description",
            shortName: "shortName",
            template: function (s) { return s + " template"; }
        };
        var push = sinon_1.stub();
        var context = routing_1.mockRouterContext(push);
        var wrapper = enzyme_1.mount(React.createElement(Search_1.default, { searchData: searchData }), { context: context });
        var form = wrapper.find("form").first();
        chai_1.expect(form).to.be.ok;
        var input = wrapper.find("input").getDOMNode();
        input.value = "Indésirable";
        form.simulate("submit");
        chai_1.expect(push.callCount).to.equal(1);
        chai_1.expect(push.args[0][0]).to.equal(context.pathFor("Ind%C3%A9sirable template", null));
    });
    it("should add 'all' to language query in search term", function () {
        var searchData = {
            description: "description",
            shortName: "shortName",
            template: function (s) { return s + " template"; }
        };
        var push = sinon_1.stub();
        var context = routing_1.mockRouterContext(push);
        var wrapper = enzyme_1.mount(React.createElement(Search_1.default, { searchData: searchData, allLanguageSearch: true }), { context: context });
        var form = wrapper.find("form").first();
        chai_1.expect(form).to.be.ok;
        var input = wrapper.find("input").getDOMNode();
        input.value = "hamlet";
        form.simulate("submit");
        chai_1.expect(push.callCount).to.equal(1);
        chai_1.expect(push.args[0][0]).to.equal(context.pathFor("hamlet template&language=all", null));
    });
});
