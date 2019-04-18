"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var testData = {
    lanes: [],
    books: [{
            id: "test id",
            url: "http://example.com/book",
            title: "test title"
        }]
};
var DataFetcher_1 = require("../__mocks__/DataFetcher");
var fetcher = new DataFetcher_1.default();
var actions_1 = require("../actions");
var actions = new actions_1.default(fetcher);
describe("actions", function () {
    describe("fetchBlob", function () {
        var type = "TEST";
        var url = "test url";
        it("dispatches request and success", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        fetcher.testData = { blob: function () { return "blob"; }, ok: true };
                        return [4 /*yield*/, actions.fetchBlob(type, url)(dispatch)];
                    case 1:
                        data = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(2);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(type + "_" + actions_1.default.REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(type + "_" + actions_1.default.SUCCESS);
                        chai_1.expect(data).to.equal("blob");
                        return [2 /*return*/];
                }
            });
        }); });
        it("dispatches failure on bad response", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, err_1, expectedError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        fetcher.testData = { ok: false, status: 500 };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, actions.fetchBlob(type, url)(dispatch)];
                    case 2:
                        _a.sent();
                        // shouldn't get here
                        chai_1.expect(false).to.equal(true);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(2);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(type + "_" + actions_1.default.REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(type + "_" + actions_1.default.FAILURE);
                        expectedError = {
                            status: 500,
                            response: "Request failed",
                            url: url
                        };
                        chai_1.expect(dispatch.args[1][0].error).to.deep.equal(expectedError);
                        chai_1.expect(err_1).to.deep.equal(expectedError);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it("dispatches failure on no response", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, err_2, expectedError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, actions.fetchBlob(type, url)(dispatch)];
                    case 2:
                        _a.sent();
                        // shouldn't get here
                        chai_1.expect(false).to.equal(true);
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(2);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(type + "_" + actions_1.default.REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(type + "_" + actions_1.default.FAILURE);
                        expectedError = "test error";
                        chai_1.expect(dispatch.args[1][0].error).to.equal(expectedError);
                        chai_1.expect(err_2).to.equal(expectedError);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    describe("fetchJSON", function () {
        var type = "TEST";
        var url = "test url";
        it("dispatches request, load, and success", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, jsonResponse, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        jsonResponse = new Promise(function (resolve) { return resolve({ test: 1 }); });
                        fetcher.testData = { json: function () { return jsonResponse; }, ok: true };
                        return [4 /*yield*/, actions.fetchJSON(type, url)(dispatch)];
                    case 1:
                        data = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(3);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(type + "_" + actions_1.default.REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(type + "_" + actions_1.default.SUCCESS);
                        chai_1.expect(dispatch.args[2][0].type).to.equal(type + "_" + actions_1.default.LOAD);
                        chai_1.expect(dispatch.args[2][0].data).to.deep.equal({ test: 1 });
                        chai_1.expect(data).to.deep.equal({ test: 1 });
                        return [2 /*return*/];
                }
            });
        }); });
        it("dispatches failure on non-json response", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, jsonResponse, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        jsonResponse = new Promise(function (_, reject) { return reject(); });
                        fetcher.testData = { json: function () { return jsonResponse; }, ok: true };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, actions.fetchJSON(type, url)(dispatch)];
                    case 2:
                        _a.sent();
                        // shouldn't get here
                        chai_1.expect(false).to.equal(true);
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(2);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(type + "_" + actions_1.default.REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(type + "_" + actions_1.default.FAILURE);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it("dispatches failure on bad response with problem detail", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, problemDetail, err_4, expectedError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        problemDetail = new Promise(function (resolve) { return resolve({ detail: "detail" }); });
                        fetcher.testData = { ok: false, status: 500, json: function () { return problemDetail; } };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, actions.fetchJSON(type, url)(dispatch)];
                    case 2:
                        _a.sent();
                        // shouldn't get here
                        chai_1.expect(false).to.equal(true);
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(2);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(type + "_" + actions_1.default.REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(type + "_" + actions_1.default.FAILURE);
                        expectedError = {
                            status: 500,
                            response: "detail",
                            url: url
                        };
                        chai_1.expect(dispatch.args[1][0].error).to.deep.equal(expectedError);
                        chai_1.expect(err_4).to.deep.equal(expectedError);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it("dispatches failure on bad response without problem detail", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, notAProblemDetail, err_5, expectedError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        notAProblemDetail = new Promise(function (_, reject) { return reject(); });
                        fetcher.testData = { ok: false, status: 500, json: function () { return notAProblemDetail; } };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, actions.fetchJSON(type, url)(dispatch)];
                    case 2:
                        _a.sent();
                        // shouldn't get here
                        chai_1.expect(false).to.equal(true);
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(2);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(type + "_" + actions_1.default.REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(type + "_" + actions_1.default.FAILURE);
                        expectedError = {
                            status: 500,
                            response: "Request failed",
                            url: url
                        };
                        chai_1.expect(dispatch.args[1][0].error).to.deep.equal(expectedError);
                        chai_1.expect(err_5).to.deep.equal(expectedError);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it("dispatches failure on no response", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, err_6, expectedError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = false;
                        fetcher.testError = { message: "test error" };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, actions.fetchJSON(type, url)(dispatch)];
                    case 2:
                        _a.sent();
                        // shouldn't get here
                        chai_1.expect(false).to.equal(true);
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(2);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(type + "_" + actions_1.default.REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(type + "_" + actions_1.default.FAILURE);
                        expectedError = {
                            status: null,
                            response: "test error",
                            url: url
                        };
                        chai_1.expect(dispatch.args[1][0].error).to.deep.equal(expectedError);
                        chai_1.expect(err_6).to.deep.equal(expectedError);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    describe("fetchOPDS", function () {
        var type = "TEST";
        var url = "test url";
        it("dispatches request, success, and load", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        fetcher.testData = testData;
                        return [4 /*yield*/, actions.fetchOPDS(type, url)(dispatch)];
                    case 1:
                        data = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(3);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(type + "_" + actions_1.default.REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(type + "_" + actions_1.default.SUCCESS);
                        chai_1.expect(dispatch.args[2][0].type).to.equal(type + "_" + actions_1.default.LOAD);
                        chai_1.expect(data).to.deep.equal(testData);
                        return [2 /*return*/];
                }
            });
        }); });
        it("dispatches failure on bad response", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = false;
                        fetcher.testError = "test error";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, actions.fetchOPDS(type, url)(dispatch)];
                    case 2:
                        _a.sent();
                        // shouldn't get here
                        chai_1.expect(false).to.equal(true);
                        return [3 /*break*/, 4];
                    case 3:
                        err_7 = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(2);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(type + "_" + actions_1.default.REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(type + "_" + actions_1.default.FAILURE);
                        chai_1.expect(dispatch.args[1][0].error).to.equal("test error");
                        chai_1.expect(err_7).to.equal("test error");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    describe("fetchCollection", function () {
        it("dispatches request, load, and success", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        fetcher.testData = testData;
                        return [4 /*yield*/, actions.fetchCollection("http://example.com/feed")(dispatch)];
                    case 1:
                        data = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(3);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(actions_1.default.COLLECTION_REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(actions_1.default.COLLECTION_SUCCESS);
                        chai_1.expect(dispatch.args[2][0].type).to.equal(actions_1.default.COLLECTION_LOAD);
                        chai_1.expect(data).to.equal(testData);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("fetchPage", function () {
        it("dispatches request, success, and load", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        fetcher.testData = testData;
                        return [4 /*yield*/, actions.fetchPage("http://example.com/feed")(dispatch)];
                    case 1:
                        data = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(3);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(actions_1.default.PAGE_REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(actions_1.default.PAGE_SUCCESS);
                        chai_1.expect(dispatch.args[2][0].type).to.equal(actions_1.default.PAGE_LOAD);
                        chai_1.expect(data).to.equal(testData);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("fetchSearchDescription", function () {
        it("dispatches load", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        fetcher.testData = testData;
                        return [4 /*yield*/, actions.fetchSearchDescription("http://example.com/search")(dispatch)];
                    case 1:
                        data = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(1);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(actions_1.default.SEARCH_DESCRIPTION_LOAD);
                        chai_1.expect(data).to.equal(testData);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("fetchBook", function () {
        it("dispatches request, load, and success", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        fetcher.testData = testData;
                        return [4 /*yield*/, actions.fetchBook("http://example.com/book")(dispatch)];
                    case 1:
                        data = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(3);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(actions_1.default.BOOK_REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(actions_1.default.BOOK_SUCCESS);
                        chai_1.expect(dispatch.args[2][0].type).to.equal(actions_1.default.BOOK_LOAD);
                        chai_1.expect(data).to.equal(testData);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("updateBook", function () {
        var borrowUrl = "http://example.com/book/borrow";
        var fulfillmentUrl = "http://example.com/book/fulfill";
        var mimeType = "mime/type";
        it("dispatches request, load, and success", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        fetcher.testData = { fulfillmentUrl: fulfillmentUrl, mimeType: mimeType };
                        return [4 /*yield*/, actions.updateBook(borrowUrl)(dispatch)];
                    case 1:
                        data = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(3);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(actions_1.default.UPDATE_BOOK_REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(actions_1.default.UPDATE_BOOK_SUCCESS);
                        chai_1.expect(dispatch.args[2][0].type).to.equal(actions_1.default.UPDATE_BOOK_LOAD);
                        chai_1.expect(data).to.equal(fetcher.testData);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("fulfillBook", function () {
        var fulfillmentUrl = "http://example.com/book/fulfill";
        it("dispatches request, load, and success", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        fetcher.testData = { blob: function () { return "blob"; }, ok: true };
                        return [4 /*yield*/, actions.fulfillBook(fulfillmentUrl)(dispatch)];
                    case 1:
                        data = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(2);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(actions_1.default.FULFILL_BOOK_REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(actions_1.default.FULFILL_BOOK_SUCCESS);
                        chai_1.expect(data).to.equal("blob");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("indirectFulfillBook", function () {
        var fulfillmentUrl = "http://example.com/book/fulfill";
        var fulfillmentType = "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";
        var indirectUrl = "http://example.com/reader";
        it("dispatches request, load, and success", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        fetcher.testData = {
                            fulfillmentLinks: [
                                { url: indirectUrl, type: fulfillmentType }
                            ]
                        };
                        return [4 /*yield*/, actions.indirectFulfillBook(fulfillmentUrl, fulfillmentType)(dispatch)];
                    case 1:
                        url = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(2);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(actions_1.default.FULFILL_BOOK_REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(actions_1.default.FULFILL_BOOK_SUCCESS);
                        chai_1.expect(url).to.equal(indirectUrl);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("fetchLoans", function () {
        var loansUrl = "http://example.com/loans";
        it("dispatches request, load, and success", function () { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = sinon_1.stub();
                        fetcher.resolve = true;
                        fetcher.testData = testData;
                        return [4 /*yield*/, actions.fetchLoans(loansUrl)(dispatch)];
                    case 1:
                        data = _a.sent();
                        chai_1.expect(dispatch.callCount).to.equal(3);
                        chai_1.expect(dispatch.args[0][0].type).to.equal(actions_1.default.LOANS_REQUEST);
                        chai_1.expect(dispatch.args[1][0].type).to.equal(actions_1.default.LOANS_SUCCESS);
                        chai_1.expect(dispatch.args[2][0].type).to.equal(actions_1.default.LOANS_LOAD);
                        chai_1.expect(data).to.equal(testData);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("closeErrorAndHideAuthForm", function () {
        it("closes error message", function () {
            var dispatch = sinon_1.stub();
            actions.closeErrorAndHideAuthForm()(dispatch);
            chai_1.expect(dispatch.callCount).to.equal(2);
            chai_1.expect(dispatch.args[0][0].type).to.equal(actions_1.default.CLOSE_ERROR);
            chai_1.expect(dispatch.args[1][0].type).to.equal(actions_1.default.HIDE_AUTH_FORM);
        });
    });
    describe("saveAuthCredentials", function () {
        it("sets fetcher credentials", function () {
            var credentials = { provider: "test", credentials: "credentials" };
            actions.saveAuthCredentials(credentials);
            chai_1.expect(fetcher.setAuthCredentials.callCount).to.equal(1);
            chai_1.expect(fetcher.setAuthCredentials.args[0][0]).to.deep.equal(credentials);
        });
    });
    describe("clearAuthCredentials", function () {
        it("clears fetcher credentials", function () {
            fetcher.clearAuthCredentials = sinon_1.stub();
            actions.clearAuthCredentials();
            chai_1.expect(fetcher.clearAuthCredentials.callCount).to.equal(1);
        });
    });
    describe("setPreference", function () {
        it("creates an action", function () {
            var action = actions.setPreference("key", "value");
            chai_1.expect(action.type).to.equal(actions_1.default.SET_PREFERENCE);
            chai_1.expect(action.key).to.equal("key");
            chai_1.expect(action.value).to.equal("value");
        });
    });
});
