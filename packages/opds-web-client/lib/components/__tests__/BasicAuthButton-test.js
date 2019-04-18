"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var enzyme_1 = require("enzyme");
var BasicAuthButton_1 = require("../BasicAuthButton");
var BasicAuthPlugin_1 = require("../../BasicAuthPlugin");
describe("BasicAuthButton", function () {
    describe("rendering", function () {
        var wrapper, provider, onClick;
        beforeEach(function () {
            provider = {
                id: "id",
                plugin: BasicAuthPlugin_1.default,
                method: {
                    description: "Test Basic Auth",
                    labels: {
                        login: "code name",
                        password: "secret password"
                    }
                }
            };
            onClick = sinon_1.stub();
            wrapper = enzyme_1.shallow(React.createElement(BasicAuthButton_1.default, { provider: provider, onClick: onClick }));
        });
        it("shows input with provider name", function () {
            var input = wrapper.find("input");
            chai_1.expect(input.prop("value")).to.contain(provider.method.description);
        });
        it("calls onClick", function () {
            var input = wrapper.find("input");
            input.simulate("click");
            chai_1.expect(onClick.callCount).to.equal(1);
        });
    });
});
