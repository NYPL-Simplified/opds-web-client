"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var React = require("react");
var enzyme_1 = require("enzyme");
var SkipNavigationLink_1 = require("../SkipNavigationLink");
describe("SkipNavigationLink", function () {
    it("shows link", function () {
        var wrapper = enzyme_1.shallow(React.createElement(SkipNavigationLink_1.default, { target: "#main" }));
        var element = wrapper.find(".skip-navigation a");
        chai_1.expect(element.text()).to.equal("Skip navigation");
        chai_1.expect(element.props().href).to.equal("#main");
    });
    it("uses label", function () {
        var wrapper = enzyme_1.shallow(React.createElement(SkipNavigationLink_1.default, { target: "#main", label: "skippable things" }));
        var element = wrapper.find(".skip-navigation a");
        chai_1.expect(element.text()).to.equal("Skip skippable things");
    });
});
