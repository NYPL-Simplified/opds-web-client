"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        showAuthFormStub = sinon_1.stub(actions_1.default.prototype, "showAuthForm").callsArg(0);
        hideAuthFormStub = sinon_1.stub(actions_1.default.prototype, "hideAuthForm").callsFake(function () { return ({ type: "" }); });
        clearAuthCredentialsStub = sinon_1.stub(DataFetcher_1.default.prototype, "clearAuthCredentials").callsFake(function () { });
        next = sinon_1.stub().returns(new Promise(function (resolve) {
            resolve({});
        }));
        store = {
            dispatch: sinon_1.stub().returns(new Promise(function (resolve) {
                resolve({});
            })),
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
    it("hides the auth form, calls the action, and does nothing else if it succeeds", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, authMiddleware(store)(next)(function () { })
                        .then(function () {
                        chai_1.expect(hideAuthFormStub.callCount).to.equal(1);
                        chai_1.expect(next.callCount).to.equal(2);
                    })
                        .catch(function (err) {
                        console.log(err);
                        throw err;
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("hides the auth form, calls the action, and hides the auth form again if the action returns a non-401 error", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    next.onCall(1).returns(new Promise(function (resolve, reject) {
                        reject({ status: 500 });
                    }));
                    return [4 /*yield*/, authMiddleware(store)(next)(function () { })
                            .then(function () {
                            chai_1.expect(hideAuthFormStub.callCount).to.equal(2);
                            chai_1.expect(next.callCount).to.equal(3);
                        })
                            .catch(function (err) {
                            console.log(err);
                            throw err;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("hides the auth form, calls the action, and does nothing else if the error response wasn't json", function () { return __awaiter(void 0, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    error = {
                        status: 401,
                        response: "not json"
                    };
                    next.onCall(1).returns(new Promise(function (resolve, reject) {
                        reject(error);
                    }));
                    return [4 /*yield*/, authMiddleware(store)(next)(function () { })
                            .then(function () {
                            chai_1.expect(hideAuthFormStub.callCount).to.equal(1);
                            chai_1.expect(next.callCount).to.equal(2);
                        })
                            .catch(function (err) {
                            console.log(err);
                            throw err;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("hides the auth form, calls the action, and does nothing else if the browser's default basic auth form was shown", function () { return __awaiter(void 0, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    error = {
                        status: 401,
                        response: JSON.stringify({ title: "error" }),
                        headers: {
                            "www-authenticate": "basic library card"
                        }
                    };
                    next.onCall(1).returns(new Promise(function (resolve, reject) {
                        reject(error);
                    }));
                    return [4 /*yield*/, authMiddleware(store)(next)(function () { })
                            .then(function () {
                            chai_1.expect(hideAuthFormStub.callCount).to.equal(1);
                            chai_1.expect(next.callCount).to.equal(2);
                        })
                            .catch(function (err) {
                            console.log(err);
                            throw err;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("clears existing credentials", function () { return __awaiter(void 0, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataFetcher.setAuthCredentials({
                        provider: "test",
                        credentials: "credentials"
                    });
                    store.getState.returns({ auth: {}, collection: {}, book: {} });
                    error = {
                        status: 401,
                        response: JSON.stringify({ title: "error" })
                    };
                    next.onCall(1).returns(new Promise(function (resolve, reject) {
                        reject(error);
                    }));
                    return [4 /*yield*/, authMiddleware(store)(next)(function () { })
                            .then(function () {
                            chai_1.expect(clearAuthCredentialsStub.callCount).to.equal(1);
                        })
                            .catch(function (err) {
                            console.log(err);
                            throw err;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("shows auth form with provider info from failed request if there were no existing credentials", function () { return __awaiter(void 0, void 0, void 0, function () {
        var authentication, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store.getState.returns({ auth: {}, collection: {}, book: {} });
                    authentication = [{ type: "test", id: "a provider" }];
                    error = {
                        status: 401,
                        response: JSON.stringify({ title: "Library", authentication: authentication })
                    };
                    next.onCall(1).returns(new Promise(function (resolve, reject) {
                        reject(error);
                    }));
                    return [4 /*yield*/, authMiddleware(store)(next)(function () { })
                            .then(function () {
                            chai_1.expect(showAuthFormStub.callCount).to.equal(1);
                            chai_1.expect(showAuthFormStub.args[0][2]).to.deep.equal([
                                {
                                    id: "a provider",
                                    plugin: plugin,
                                    method: authentication[0]
                                }
                            ]);
                            chai_1.expect(showAuthFormStub.args[0][3]).to.equal("Library");
                        })
                            .catch(function (err) {
                            console.log(err);
                            throw err;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("shows auth form with provider info from store if existing credentials failed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var providers, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataFetcher.setAuthCredentials({
                        provider: "test",
                        credentials: "credentials"
                    });
                    providers = [
                        {
                            id: "a provider",
                            plugin: plugin,
                            method: "test method"
                        }
                    ];
                    store.getState.returns({
                        auth: {
                            title: "Library",
                            providers: providers
                        },
                        collection: {},
                        book: {}
                    });
                    error = {
                        status: 401,
                        response: JSON.stringify({ title: "error" })
                    };
                    next.onCall(1).returns(new Promise(function (resolve, reject) {
                        reject(error);
                    }));
                    return [4 /*yield*/, authMiddleware(store)(next)(function () { })
                            .then(function () {
                            chai_1.expect(showAuthFormStub.callCount).to.equal(1);
                            chai_1.expect(showAuthFormStub.args[0][2]).to.deep.equal([
                                {
                                    id: "a provider",
                                    plugin: plugin,
                                    method: "test method"
                                }
                            ]);
                            chai_1.expect(showAuthFormStub.args[0][3]).to.equal("Library");
                            chai_1.expect(showAuthFormStub.args[0][4]).to.equal("error");
                            chai_1.expect(showAuthFormStub.args[0][5]).to.equal("test");
                        })
                            .catch(function (err) {
                            console.log(err);
                            throw err;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("retries action without credentials if existing credentials failed and there aren't providers in the store", function () { return __awaiter(void 0, void 0, void 0, function () {
        var error, action;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataFetcher.setAuthCredentials({
                        provider: "test",
                        credentials: "credentials"
                    });
                    store.getState.returns({
                        auth: { providers: null },
                        collection: {},
                        book: {}
                    });
                    error = {
                        status: 401,
                        response: JSON.stringify({ title: "error" })
                    };
                    next.onCall(1).returns(new Promise(function (resolve, reject) {
                        reject(error);
                    }));
                    action = sinon_1.stub();
                    return [4 /*yield*/, authMiddleware(store)(next)(action)
                            .then(function () {
                            chai_1.expect(showAuthFormStub.callCount).to.equal(0);
                            chai_1.expect(clearAuthCredentialsStub.callCount).to.equal(1);
                            chai_1.expect(store.dispatch.callCount).to.equal(2);
                            chai_1.expect(store.dispatch.args[1][0]).to.equal(action);
                        })
                            .catch(function (err) {
                            console.log(err);
                            throw err;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("does not call showAuthForm if there's no supported auth method in the auth document", function () { return __awaiter(void 0, void 0, void 0, function () {
        var authentication, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store.getState.returns({ auth: {}, collection: {}, book: {} });
                    authentication = [{ type: "unknown method", id: "a provider" }];
                    error = {
                        status: 401,
                        response: JSON.stringify({ title: "Library", authentication: authentication })
                    };
                    next.onCall(1).returns(new Promise(function (resolve, reject) {
                        reject(error);
                    }));
                    return [4 /*yield*/, authMiddleware(store)(next)(function () { })
                            .then(function () {
                            chai_1.expect(showAuthFormStub.callCount).to.equal(0);
                            chai_1.expect(hideAuthFormStub.callCount).to.equal(2);
                        })
                            .catch(function (err) {
                            console.log(err);
                            throw err;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("makes cancel go to previous page if url has changed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var authentication, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store.getState.returns({ auth: {}, collection: { url: "old" }, book: {} });
                    pathFor.returns("new");
                    authentication = [{ type: "test", id: "a provider" }];
                    error = {
                        status: 401,
                        response: JSON.stringify({ title: "Library", authentication: authentication })
                    };
                    next.onCall(1).returns(new Promise(function (resolve, reject) {
                        reject(error);
                    }));
                    return [4 /*yield*/, authMiddleware(store)(next)(function () { })
                            .then(function () {
                            chai_1.expect(showAuthFormStub.callCount).to.equal(1);
                            var cancel = showAuthFormStub.args[0][1];
                            var historySpy = sinon_1.spy(history, "back");
                            cancel();
                            historySpy.restore();
                            chai_1.expect(historySpy.callCount).to.equal(1);
                        })
                            .catch(function (err) {
                            console.log(err);
                            throw err;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("makes cancel hide the form if url hasn't changed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var authentication, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store.getState.returns({ auth: {}, collection: {}, book: {} });
                    // "/" is the value of window.location.pathname when running tests
                    pathFor.returns("/");
                    authentication = [{ type: "test", id: "a provider" }];
                    error = {
                        status: 401,
                        response: JSON.stringify({ name: "Library", authentication: authentication })
                    };
                    next.onCall(1).returns(new Promise(function (resolve, reject) {
                        reject(error);
                    }));
                    return [4 /*yield*/, authMiddleware(store)(next)(function () { })
                            .then(function () {
                            chai_1.expect(showAuthFormStub.callCount).to.equal(1);
                            chai_1.expect(hideAuthFormStub.callCount).to.equal(1);
                            var cancel = showAuthFormStub.args[0][1];
                            cancel();
                            chai_1.expect(hideAuthFormStub.callCount).to.equal(2);
                        })
                            .catch(function (err) {
                            console.log(err);
                            throw err;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
