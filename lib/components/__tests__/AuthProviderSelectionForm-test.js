"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var enzyme_1 = require("enzyme");
var AuthProviderSelectionForm_1 = require("../AuthProviderSelectionForm");
var BasicAuthPlugin_1 = require("../../BasicAuthPlugin");
var BasicAuthForm_1 = require("../BasicAuthForm");
var BasicAuthButton_1 = require("../BasicAuthButton");
describe("AuthProviderSelectionForm", function () {
    var provider1, provider2;
    beforeEach(function () {
        provider1 = {
            id: "Provider 1",
            plugin: BasicAuthPlugin_1.default,
            method: {
                labels: {
                    login: "login 1",
                    password: "password 1"
                }
            }
        };
        provider2 = {
            id: "Provider 2",
            plugin: BasicAuthPlugin_1.default,
            method: {
                labels: {
                    login: "login 2",
                    password: "password 2"
                }
            }
        };
    });
    describe("with one provider", function () {
        var wrapper;
        var hide;
        var saveCredentials;
        var cancel;
        beforeEach(function () {
            hide = sinon_1.stub();
            saveCredentials = sinon_1.stub();
            cancel = sinon_1.stub();
            wrapper = enzyme_1.shallow(React.createElement(AuthProviderSelectionForm_1.default, { hide: hide, saveCredentials: saveCredentials, cancel: cancel, title: "Intergalactic Spy Network", error: "you forgot the secret password! what kind of spy arre you?", providers: [provider1] }));
        });
        describe("rendering", function () {
            it("shows title", function () {
                var title = wrapper.find("h3");
                chai_1.expect(title.text()).to.equal("Intergalactic Spy Network Login");
            });
            it("shows auth form for the provider", function () {
                var form = wrapper.find(BasicAuthForm_1.default);
                chai_1.expect(form.length).to.equal(1);
                chai_1.expect(form.props().provider).to.deep.equal(provider1);
                chai_1.expect(form.props().hide).to.equal(hide);
                chai_1.expect(form.props().cancel).to.equal(cancel);
                chai_1.expect(form.props().saveCredentials).to.equal(saveCredentials);
                chai_1.expect(form.props().error).to.equal("you forgot the secret password! what kind of spy arre you?");
            });
            it("does not show provider selection button", function () {
                var button = wrapper.find(BasicAuthButton_1.default);
                chai_1.expect(button.length).to.equal(0);
            });
            it("does not show cancel button", function () {
                var button = wrapper.find("button");
                chai_1.expect(button.length).to.equal(0);
            });
        });
    });
    describe("with two providers", function () {
        var wrapper;
        var hide;
        var saveCredentials;
        var cancel;
        beforeEach(function () {
            hide = sinon_1.stub();
            saveCredentials = sinon_1.stub();
            cancel = sinon_1.stub();
            wrapper = enzyme_1.mount(React.createElement(AuthProviderSelectionForm_1.default, { hide: hide, saveCredentials: saveCredentials, cancel: cancel, title: "Intergalactic Spy Network", error: "you forgot the secret password! what kind of spy arre you?", providers: [provider1, provider2] }));
        });
        describe("rendering", function () {
            it("shows title", function () {
                var title = wrapper.find("h3");
                chai_1.expect(title.text()).to.equal("Intergalactic Spy Network Login");
            });
            it("shows auth buttons for both providers", function () {
                var buttons = wrapper.find(BasicAuthButton_1.default);
                chai_1.expect(buttons.length).to.equal(2);
                chai_1.expect(buttons.at(0).props().provider).to.deep.equal(provider1);
                chai_1.expect(buttons.at(1).props().provider).to.deep.equal(provider2);
            });
            it("shows cancel button", function () {
                var button = wrapper.find("button");
                chai_1.expect(button.length).to.equal(1);
            });
        });
        describe("behavior", function () {
            it("selects a provider", function () {
                chai_1.expect(wrapper.state().selectedProvider).to.be.null;
                var buttons = wrapper.find(BasicAuthButton_1.default);
                buttons.at(1).simulate("click");
                chai_1.expect(wrapper.state().selectedProvider).to.equal(provider2);
            });
            it("shows auth form for selected provider", function () {
                wrapper.setState({ selectedProvider: provider1 });
                wrapper.update();
                var form = wrapper.find(BasicAuthForm_1.default);
                chai_1.expect(form.length).to.equal(1);
                chai_1.expect(form.props().provider).to.deep.equal(provider1);
                chai_1.expect(form.props().hide).to.equal(hide);
                chai_1.expect(form.props().cancel).to.equal(cancel);
                chai_1.expect(form.props().saveCredentials).to.equal(saveCredentials);
                chai_1.expect(form.props().error).to.equal("you forgot the secret password! what kind of spy arre you?");
            });
            it("selects previously attempted provider if there was an error", function () {
                wrapper = enzyme_1.mount(React.createElement(AuthProviderSelectionForm_1.default, { hide: hide, saveCredentials: saveCredentials, cancel: cancel, title: "Intergalactic Spy Network", error: "you forgot the secret password! what kind of spy arre you?", attemptedProvider: "Provider 2", providers: [provider1, provider2] }));
                chai_1.expect(wrapper.state().selectedProvider).to.equal(provider2);
            });
        });
    });
});
