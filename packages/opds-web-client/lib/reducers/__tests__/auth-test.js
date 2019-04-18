"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var auth_1 = require("../auth");
var DataFetcher_1 = require("../../DataFetcher");
var actions_1 = require("../../actions");
var OPDSDataAdapter_1 = require("../../OPDSDataAdapter");
var BasicAuthPlugin_1 = require("../../BasicAuthPlugin");
var fetcher = new DataFetcher_1.default({ adapter: OPDSDataAdapter_1.adapter });
var actions = new actions_1.default(fetcher);
describe("auth reducer", function () {
    var initState = {
        showForm: false,
        callback: null,
        cancel: null,
        credentials: null,
        title: null,
        error: null,
        attemptedProvider: null,
        providers: null
    };
    it("returns the initial state", function () {
        chai_1.expect(auth_1.default(undefined, {})).to.deep.equal(initState);
    });
    it("handles SHOW_AUTH_FORM", function () {
        var callback = sinon_1.stub();
        var cancel = sinon_1.stub();
        var provider = {
            id: "library",
            plugin: BasicAuthPlugin_1.default,
            method: {
                type: BasicAuthPlugin_1.default.type,
                labels: {
                    login: "barcode",
                    password: "pin"
                }
            }
        };
        var action = actions.showAuthForm(callback, cancel, [provider], "library");
        var newState = Object.assign({}, initState, {
            showForm: true,
            callback: callback,
            cancel: cancel,
            title: "library",
            providers: [provider]
        });
        chai_1.expect(auth_1.default(initState, action)).to.deep.equal(newState);
    });
    it("handles SHOW_AUTH_FORM after error", function () {
        var callback = sinon_1.stub();
        var cancel = sinon_1.stub();
        var provider = {
            id: "library",
            plugin: BasicAuthPlugin_1.default,
            method: {
                type: BasicAuthPlugin_1.default.type,
                labels: {
                    login: "barcode",
                    password: "pin"
                }
            }
        };
        var error = "Invalid Credentials";
        var attemptedProvider = "library";
        var action = actions.showAuthForm(callback, cancel, [provider], "library", error, attemptedProvider);
        var previousAttemptState = Object.assign({}, initState, { title: "library" });
        var newState = Object.assign({}, previousAttemptState, {
            showForm: true,
            callback: callback,
            cancel: cancel,
            title: "library",
            providers: [provider],
            error: error,
            attemptedProvider: attemptedProvider
        });
        chai_1.expect(auth_1.default(previousAttemptState, action)).to.deep.equal(newState);
    });
    it("handles HIDE_AUTH_FORM", function () {
        var oldState = Object.assign({}, initState, {
            showForm: true,
            error: "test error"
        });
        var action = actions.hideAuthForm();
        var newState = Object.assign({}, oldState, {
            showForm: false,
            error: null
        });
        chai_1.expect(auth_1.default(oldState, action)).to.deep.equal(newState);
    });
    it("handles SAVE_AUTH_CREDENTIALS", function () {
        var credentials = { provider: "test", credentials: "credentials" };
        var action = actions.saveAuthCredentials(credentials);
        var newState = Object.assign({}, initState, {
            credentials: credentials
        });
        chai_1.expect(auth_1.default(initState, action)).to.deep.equal(newState);
    });
    it("handles CLEAR_AUTH_CREDENTIALS", function () {
        var credentials = { provider: "test", credentials: "credentials" };
        var oldState = Object.assign({}, initState, {
            credentials: credentials
        });
        var action = actions.clearAuthCredentials();
        var newState = Object.assign({}, initState, {
            credentials: null
        });
        chai_1.expect(auth_1.default(oldState, action)).to.deep.equal(newState);
    });
});
