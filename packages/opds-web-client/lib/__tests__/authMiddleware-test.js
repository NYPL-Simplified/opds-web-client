"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var authMiddleware_1 = require("../authMiddleware");
var actions_1 = require("../actions");
var DataFetcher_1 = require("../DataFetcher");
var hideAuthFormStub;
var clearAuthCredentialsStub;
var showAuthFormStub;
describe("authMiddleware", function () {
    var next;
    var authMiddleware;
    var plugin;
    var pathFor;
    var store;
    var dataFetcher;
    beforeEach(function () {
        dataFetcher = new DataFetcher_1.default();
        dataFetcher.clearAuthCredentials();
        // clearAuthCredentialsStub = stub();
        // showAuthFormStub = stub();
        showAuthFormStub = sinon_1.stub(actions_1.default.prototype, "showAuthForm").callsFake(function () { });
        hideAuthFormStub = sinon_1.stub(actions_1.default.prototype, "hideAuthForm").callsFake(function () { });
        clearAuthCredentialsStub = sinon_1.stub(DataFetcher_1.default.prototype, "clearAuthCredentials").callsFake(function () { });
        next = sinon_1.stub().returns(new Promise(function (resolve, reject) { resolve({}); }));
        store = {
            dispatch: sinon_1.stub().returns(new Promise(function (resolve, reject) { resolve({}); })),
            getState: sinon_1.stub()
        };
        plugin = {
            type: "test",
            lookForCredentials: sinon_1.stub(),
            formComponent: null,
            buttonComponent: null
        };
        pathFor = sinon_1.stub();
        authMiddleware = authMiddleware_1.default([plugin], pathFor);
    });
    afterEach(function () {
        showAuthFormStub.restore();
        hideAuthFormStub.restore();
        clearAuthCredentialsStub.restore();
    });
    it("handles a plain action (not a thunk)", function () {
        var next = sinon_1.stub();
        authMiddleware(store)(next)({});
        chai_1.expect(hideAuthFormStub.callCount).to.equal(1);
        chai_1.expect(next.callCount).to.equal(2);
    });
    it("hides the auth form, calls the action, and does nothing else if it succeeds", function (done) {
        authMiddleware(store)(next)(function () { }).then(function () {
            chai_1.expect(hideAuthFormStub.callCount).to.equal(1);
            chai_1.expect(next.callCount).to.equal(2);
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
    it("hides the auth form, calls the action, and hides the auth form again if the action returns a non-401 error", function (done) {
        next.onCall(1).returns(new Promise(function (resolve, reject) { reject({ status: 500 }); }));
        authMiddleware(store)(next)(function () { }).then(function (arg) {
            chai_1.expect(hideAuthFormStub.callCount).to.equal(2);
            chai_1.expect(next.callCount).to.equal(3);
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
    it("hides the auth form, calls the action, and does nothing else if the error response wasn't json", function (done) {
        var error = {
            status: 401,
            response: "not json"
        };
        next.onCall(1).returns(new Promise(function (resolve, reject) { reject(error); }));
        authMiddleware(store)(next)(function () { }).then(function () {
            chai_1.expect(hideAuthFormStub.callCount).to.equal(1);
            chai_1.expect(next.callCount).to.equal(2);
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
    it("hides the auth form, calls the action, and does nothing else if the browser's default basic auth form was shown", function (done) {
        var error = {
            status: 401,
            response: JSON.stringify({ title: "error" }),
            headers: {
                "www-authenticate": "basic library card"
            }
        };
        next.onCall(1).returns(new Promise(function (resolve, reject) { reject(error); }));
        authMiddleware(store)(next)(function () { }).then(function () {
            chai_1.expect(hideAuthFormStub.callCount).to.equal(1);
            chai_1.expect(next.callCount).to.equal(2);
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
    it("clears existing credentials", function (done) {
        dataFetcher.setAuthCredentials({ provider: "test", credentials: "credentials" });
        store.getState.returns({ auth: {}, collection: {}, book: {} });
        var error = {
            status: 401,
            response: JSON.stringify({ title: "error" })
        };
        next.onCall(1).returns(new Promise(function (resolve, reject) { reject(error); }));
        authMiddleware(store)(next)(function () { }).then(function () {
            chai_1.expect(clearAuthCredentialsStub.callCount).to.equal(1);
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
    it("shows auth form with provider info from failed request if there were no existing credentials", function (done) {
        store.getState.returns({ auth: {}, collection: {}, book: {} });
        var authentication = [{ type: "test", id: "a provider" }];
        var error = {
            status: 401,
            response: JSON.stringify({ title: "Library", authentication: authentication })
        };
        next.onCall(1).returns(new Promise(function (resolve, reject) { reject(error); }));
        authMiddleware(store)(next)(function () { }).then(function () {
            chai_1.expect(showAuthFormStub.callCount).to.equal(1);
            chai_1.expect(showAuthFormStub.args[0][2]).to.deep.equal([{
                    id: "a provider",
                    plugin: plugin,
                    method: authentication[0]
                }]);
            chai_1.expect(showAuthFormStub.args[0][3]).to.equal("Library");
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
    it("shows auth form with provider info from store if existing credentials failed", function (done) {
        dataFetcher.setAuthCredentials({ provider: "test", credentials: "credentials" });
        var providers = [{
                id: "a provider",
                plugin: plugin,
                method: "test method"
            }];
        store.getState.returns({
            auth: {
                title: "Library",
                providers: providers
            },
            collection: {},
            book: {}
        });
        var error = {
            status: 401,
            response: JSON.stringify({ title: "error" })
        };
        next.onCall(1).returns(new Promise(function (resolve, reject) { reject(error); }));
        authMiddleware(store)(next)(function () { }).then(function () {
            chai_1.expect(showAuthFormStub.callCount).to.equal(1);
            chai_1.expect(showAuthFormStub.args[0][2]).to.deep.equal([{
                    id: "a provider",
                    plugin: plugin,
                    method: "test method"
                }]);
            chai_1.expect(showAuthFormStub.args[0][3]).to.equal("Library");
            chai_1.expect(showAuthFormStub.args[0][4]).to.equal("error");
            chai_1.expect(showAuthFormStub.args[0][5]).to.equal("test");
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
    it("retries action without credentials if existing credentials failed and there aren't providers in the store", function (done) {
        dataFetcher.setAuthCredentials({ provider: "test", credentials: "credentials" });
        store.getState.returns({ auth: { providers: null }, collection: {}, book: {} });
        var error = {
            status: 401,
            response: JSON.stringify({ title: "error" })
        };
        next.onCall(1).returns(new Promise(function (resolve, reject) { reject(error); }));
        var action = sinon_1.stub();
        authMiddleware(store)(next)(action).then(function () {
            chai_1.expect(showAuthFormStub.callCount).to.equal(0);
            chai_1.expect(clearAuthCredentialsStub.callCount).to.equal(1);
            chai_1.expect(store.dispatch.callCount).to.equal(2);
            chai_1.expect(store.dispatch.args[1][0]).to.equal(action);
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
    it("does not call showAuthForm if there's no supported auth method in the auth document", function (done) {
        store.getState.returns({ auth: {}, collection: {}, book: {} });
        var authentication = [{ type: "unknown method", id: "a provider" }];
        var error = {
            status: 401,
            response: JSON.stringify({ title: "Library", authentication: authentication })
        };
        next.onCall(1).returns(new Promise(function (resolve, reject) { reject(error); }));
        authMiddleware(store)(next)(function () { }).then(function () {
            chai_1.expect(showAuthFormStub.callCount).to.equal(0);
            chai_1.expect(hideAuthFormStub.callCount).to.equal(2);
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
    it("makes cancel go to previous page if url has changed", function (done) {
        store.getState.returns({ auth: {}, collection: { url: "old" }, book: {} });
        pathFor.returns("new");
        var authentication = [{ type: "test", id: "a provider" }];
        var error = {
            status: 401,
            response: JSON.stringify({ title: "Library", authentication: authentication })
        };
        next.onCall(1).returns(new Promise(function (resolve, reject) { reject(error); }));
        authMiddleware(store)(next)(function () { }).then(function () {
            chai_1.expect(showAuthFormStub.callCount).to.equal(1);
            var cancel = showAuthFormStub.args[0][1];
            var historySpy = sinon_1.spy(history, "back");
            cancel();
            historySpy.restore();
            chai_1.expect(historySpy.callCount).to.equal(1);
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
    it("makes cancel hide the form if url hasn't changed", function (done) {
        store.getState.returns({ auth: {}, collection: {}, book: {} });
        // blank is the value of window.location.pathname when running tests
        pathFor.returns("blank");
        var authentication = [{ type: "test", id: "a provider" }];
        var error = {
            status: 401,
            response: JSON.stringify({ name: "Library", authentication: authentication })
        };
        next.onCall(1).returns(new Promise(function (resolve, reject) { reject(error); }));
        authMiddleware(store)(next)(function () { }).then(function () {
            chai_1.expect(showAuthFormStub.callCount).to.equal(1);
            chai_1.expect(hideAuthFormStub.callCount).to.equal(1);
            var cancel = showAuthFormStub.args[0][1];
            cancel();
            chai_1.expect(hideAuthFormStub.callCount).to.equal(2);
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
});
