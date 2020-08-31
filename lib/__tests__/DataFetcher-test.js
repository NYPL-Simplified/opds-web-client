"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var fetchMock = require("fetch-mock");
var DataFetcher_1 = require("../DataFetcher");
var Cookie = require("js-cookie");
describe("DataFetcher", function () {
    var adapter = function (data, url) { return "adapter"; };
    describe("fetch()", function () {
        beforeEach(function () {
            fetchMock.mock("test-url", 200).mock("http://example.com", 200);
        });
        afterEach(function () {
            fetchMock.restore();
        });
        it("uses fetch()", function () {
            var options = {
                method: "POST",
                data: { test: "test" },
                credentials: "same-origin"
            };
            var fetcher = new DataFetcher_1.default({ adapter: adapter });
            fetcher.fetch("test-url", options);
            var fetchArgs = fetchMock.calls();
            chai_1.expect(fetchMock.called()).to.equal(true);
            chai_1.expect(fetchArgs[0][0]).to.equal("/test-url");
            chai_1.expect(fetchArgs[0][1]).to.deep.equal(__assign(__assign({}, options), { headers: { "X-Requested-With": "XMLHttpRequest", Authorization: "" } }));
        });
        it("sends credentials by default", function () {
            var options = {
                method: "POST",
                data: { test: "test" }
            };
            var fetcher = new DataFetcher_1.default({ adapter: adapter });
            fetcher.fetch("test-url", options);
            var fetchArgs = fetchMock.calls();
            chai_1.expect(fetchMock.called()).to.equal(true);
            chai_1.expect(fetchArgs[0][0]).to.equal("/test-url");
            chai_1.expect(fetchArgs[0][1]).to.deep.equal(__assign({ credentials: "same-origin", headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Authorization: ""
                } }, options));
        });
        it("uses proxy url if provided", function () {
            var MockFormData = /** @class */ (function () {
                function MockFormData() {
                    this.data = {};
                }
                MockFormData.prototype.append = function (key, val) {
                    this.data[key] = val;
                };
                MockFormData.prototype.get = function (key) {
                    return { value: this.data[key] };
                };
                MockFormData.prototype.apply = function () {
                    return;
                };
                return MockFormData;
            }());
            var formDataStub = sinon_1.stub(window, "FormData").callsFake(function () { return new MockFormData(); });
            var proxyUrl = "http://example.com";
            var fetcher = new DataFetcher_1.default({ proxyUrl: proxyUrl, adapter: adapter });
            fetcher.fetch("test-url");
            var fetchArgs = fetchMock.calls();
            chai_1.expect(fetchMock.called()).to.equal(true);
            chai_1.expect(fetchArgs[0][0]).to.equal(proxyUrl + "/");
            chai_1.expect(fetchArgs[0][1].method).to.equal("POST");
            chai_1.expect(fetchArgs[0][1].body.get("url").value).to.equal("test-url");
            formDataStub.restore();
        });
        it("prepares auth headers", function () {
            var fetcher = new DataFetcher_1.default({ adapter: adapter });
            var credentials = { provider: "test", credentials: "credentials" };
            fetcher.getAuthCredentials = function () { return credentials; };
            fetcher.fetch("test-url");
            var fetchArgs = fetchMock.calls();
            chai_1.expect(fetchArgs[0][1].headers["Authorization"]).to.equal("credentials");
        });
    });
    describe("Auth Credentials", function () {
        it("doesn't set auth credentials if there are none", function () {
            var fetcher = new DataFetcher_1.default({ adapter: adapter });
            fetcher.setAuthCredentials(undefined);
            chai_1.expect(Cookie.get(fetcher.authKey)).to.deep.equal(undefined);
        });
        it("sets auth credentials", function () {
            var fetcher = new DataFetcher_1.default({ adapter: adapter });
            var credentials = { provider: "test", credentials: "credentials" };
            fetcher.setAuthCredentials(credentials);
            chai_1.expect(Cookie.get(fetcher.authKey)).to.deep.equal(JSON.stringify(credentials));
        });
        it("gets auth credentials", function () {
            var fetcher = new DataFetcher_1.default({ adapter: adapter });
            var credentials = { provider: "test", credentials: "credentials" };
            Cookie.set(fetcher.authKey, JSON.stringify(credentials));
            chai_1.expect(fetcher.getAuthCredentials()).to.deep.equal(credentials);
        });
        it("clears auth credentials", function () {
            var fetcher = new DataFetcher_1.default({ adapter: adapter });
            var credentials = { provider: "test", credentials: "credentials" };
            Cookie.set(fetcher.authKey, JSON.stringify(credentials));
            fetcher.clearAuthCredentials();
            chai_1.expect(Cookie.get(fetcher.authKey)).to.equal(undefined);
        });
    });
    describe("fetchOPDSData()", function () {
        it("rejects and returns an error if the adapter isn't configured", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fetcher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetcher = new DataFetcher_1.default();
                        // No need to mock a fetch response since it should not reach that point.
                        return [4 /*yield*/, fetcher.fetchOPDSData("test-url").catch(function (err) {
                                chai_1.expect(err.status).to.equal(null);
                                chai_1.expect(err.response).to.equal("No adapter has been configured in DataFetcher.");
                                chai_1.expect(err.url).to.equal("test-url");
                            })];
                    case 1:
                        // No need to mock a fetch response since it should not reach that point.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("throws error if response isn't 200", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fetcher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchMock.mock("test-url", { status: 401, body: "unauthorized" });
                        fetcher = new DataFetcher_1.default({ adapter: adapter });
                        return [4 /*yield*/, fetcher.fetchOPDSData("test-url").catch(function (err) {
                                chai_1.expect(err.status).to.equal(401);
                                chai_1.expect(err.response).to.equal("unauthorized");
                                chai_1.expect(err.url).to.equal("test-url");
                            })];
                    case 1:
                        _a.sent();
                        fetchMock.restore();
                        return [2 /*return*/];
                }
            });
        }); });
        it("throws an error if the response is not OPDS", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fetcher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchMock.mock("test-url", { status: 200, body: "not OPDS" });
                        fetcher = new DataFetcher_1.default({ adapter: adapter });
                        return [4 /*yield*/, fetcher.fetchOPDSData("test-url").catch(function (err) {
                                chai_1.expect(err.status).to.equal(null);
                                chai_1.expect(err.response).to.equal("Failed to parse OPDS data");
                                chai_1.expect(err.url).to.equal("test-url");
                            })];
                    case 1:
                        _a.sent();
                        fetchMock.restore();
                        return [2 /*return*/];
                }
            });
        }); });
        it("throws an error on a bad call", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fetcher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchMock.mock("test-url", { status: 500, body: "nope" });
                        fetcher = new DataFetcher_1.default({ adapter: adapter });
                        return [4 /*yield*/, fetcher.fetchOPDSData("test-url").catch(function (err) {
                                chai_1.expect(err.response).to.equal("nope");
                            })];
                    case 1:
                        _a.sent();
                        fetchMock.restore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
