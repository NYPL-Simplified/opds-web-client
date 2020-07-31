"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var enzyme_1 = require("enzyme");
var BasicAuthForm_1 = require("../BasicAuthForm");
var BasicAuthPlugin_1 = require("../../BasicAuthPlugin");
var auth_1 = require("../../utils/auth");
describe("BasicAuthForm", function () {
    describe("rendering", function () {
        var wrapper, provider;
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
            wrapper = enzyme_1.shallow(React.createElement(BasicAuthForm_1.default, { hide: sinon_1.stub(), saveCredentials: sinon_1.stub(), cancel: sinon_1.stub(), error: "you forgot the secret password! what kind of spy arre you?", provider: provider }));
        });
        it("shows username input", function () {
            var input = wrapper.find("input").at(0);
            chai_1.expect(input.prop("aria-label")).to.equal("Input for code name");
        });
        it("shows password input", function () {
            var input = wrapper.find("input").at(1);
            chai_1.expect(input.prop("aria-label")).to.equal("Input for secret password");
        });
        it("shows submit button", function () {
            var input = wrapper.find("input[type='submit']");
            chai_1.expect(input.prop("value")).to.equal("Submit");
        });
        it("shows cancel button", function () {
            var button = wrapper.find("input[type='reset']");
            chai_1.expect(button.prop("value")).to.equal("Cancel");
        });
        it("shows error", function () {
            var error = wrapper.find(".auth-error");
            chai_1.expect(error.text()).to.equal("you forgot the secret password! what kind of spy arre you?");
        });
    });
    describe("behavior", function () {
        var wrapper;
        var provider;
        var hide;
        var saveCredentials;
        var callback;
        var cancel;
        beforeEach(function () {
            hide = sinon_1.stub();
            saveCredentials = sinon_1.stub();
            callback = sinon_1.stub();
            cancel = sinon_1.stub();
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
            wrapper = enzyme_1.mount(React.createElement(BasicAuthForm_1.default, { hide: hide, saveCredentials: saveCredentials, callback: callback, cancel: cancel, error: "you forgot the secret password! what kind of spy arre you?", provider: provider }));
        });
        it("validates", function () {
            // both fields blank
            var isValid = wrapper.instance().validate();
            chai_1.expect(isValid).to.equal(false);
            chai_1.expect(wrapper.state("error")).to.equal("code name is required");
            // username blank
            var username = wrapper.find("input[type='text']").getDOMNode();
            username.value = "";
            var password = wrapper.find("input[type='password']").getDOMNode();
            password.value = "thenameisbond";
            isValid = wrapper.instance().validate();
            chai_1.expect(isValid).to.equal(false);
            chai_1.expect(wrapper.state("error")).to.equal("code name is required");
            // // nothing blank
            username.value = "doubleohseven";
            isValid = wrapper.instance().validate(username.value);
            chai_1.expect(isValid).to.equal(true);
            chai_1.expect(wrapper.state("error")).to.equal(null);
        });
        describe("submission", function () {
            var validate;
            var form;
            var credentials;
            var username;
            var password;
            beforeEach(function () {
                username = wrapper.find("input[type='text']").getDOMNode();
                username.value = "doubleohseven";
                password = wrapper.find("input[type='password']").getDOMNode();
                password.value = "thenameisbond";
                credentials = auth_1.generateCredentials("doubleohseven", "thenameisbond");
                validate = sinon_1.stub().returns(true);
                wrapper.instance().validate = validate;
                form = wrapper.find("form");
                form.simulate("submit");
            });
            it("validates", function () {
                chai_1.expect(validate.callCount).to.equal(1);
            });
            it("saves credentials", function () {
                chai_1.expect(saveCredentials.callCount).to.equal(1);
                chai_1.expect(saveCredentials.args[0][0]).to.deep.equal({
                    provider: "id",
                    credentials: credentials
                });
            });
            it("hides", function () {
                chai_1.expect(hide.callCount).to.equal(1);
            });
            it("executes callback", function () {
                chai_1.expect(callback.callCount).to.equal(1);
            });
        });
        it("updates error from props", function () {
            wrapper.setProps(Object.assign({}, wrapper.props(), { error: "new error" }));
            chai_1.expect(wrapper.state("error")).to.equal("new error");
        });
        it("cancels", function () {
            var cancelButton = wrapper.find("input[type='reset']");
            cancelButton.simulate("click");
            chai_1.expect(cancel.callCount).to.equal(1);
        });
    });
});
