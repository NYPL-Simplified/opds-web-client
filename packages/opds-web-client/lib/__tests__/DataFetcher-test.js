"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var fetchMock = require("fetch-mock");
var DataFetcher_1 = require("../DataFetcher");
var Cookie = require("js-cookie");
describe("DataFetcher", function () {
    beforeEach(function () {
        fetchMock
            .mock("test-url", 200)
            .mock("http://example.com", 200);
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
        var fetcher = new DataFetcher_1.default();
        fetcher.fetch("test-url", options);
        var fetchArgs = fetchMock.calls();
        chai_1.expect(fetchMock.called()).to.equal(true);
        chai_1.expect(fetchArgs[0][0]).to.equal("/test-url");
        chai_1.expect(fetchArgs[0][1]).to.deep.equal(Object.assign({}, options, {
            headers: { "X-Requested-With": "XMLHttpRequest" }
        }));
    });
    it("sends credentials by default", function () {
        var options = {
            method: "POST",
            data: { test: "test" }
        };
        var fetcher = new DataFetcher_1.default();
        fetcher.fetch("test-url", options);
        var fetchArgs = fetchMock.calls();
        chai_1.expect(fetchMock.called()).to.equal(true);
        chai_1.expect(fetchArgs[0][0]).to.equal("/test-url");
        chai_1.expect(fetchArgs[0][1]).to.deep.equal(Object.assign({ credentials: "same-origin", headers: {
                "X-Requested-With": "XMLHttpRequest"
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
        var fetcher = new DataFetcher_1.default({ proxyUrl: proxyUrl });
        fetcher.fetch("test-url");
        var fetchArgs = fetchMock.calls();
        chai_1.expect(fetchMock.called()).to.equal(true);
        chai_1.expect(fetchArgs[0][0]).to.equal(proxyUrl + "/");
        chai_1.expect(fetchArgs[0][1].method).to.equal("POST");
        chai_1.expect(fetchArgs[0][1].body.get("url").value).to.equal("test-url");
        formDataStub.restore();
    });
    it("prepares auth headers", function () {
        var fetcher = new DataFetcher_1.default();
        var credentials = { provider: "test", credentials: "credentials" };
        fetcher.getAuthCredentials = function () { return credentials; };
        fetcher.fetch("test-url");
        var fetchArgs = fetchMock.calls();
        chai_1.expect(fetchArgs[0][1].headers["Authorization"]).to.equal("credentials");
    });
    it("sets auth credentials", function () {
        var fetcher = new DataFetcher_1.default();
        var credentials = { provider: "test", credentials: "credentials" };
        fetcher.setAuthCredentials(credentials);
        chai_1.expect(Cookie.get(fetcher.authKey)).to.deep.equal(JSON.stringify(credentials));
    });
    it("gets auth credentials", function () {
        var fetcher = new DataFetcher_1.default();
        var credentials = { provider: "test", credentials: "credentials" };
        Cookie.set(fetcher.authKey, JSON.stringify(credentials));
        chai_1.expect(fetcher.getAuthCredentials()).to.deep.equal(credentials);
    });
    it("clears auth credentials", function () {
        var fetcher = new DataFetcher_1.default();
        var credentials = { provider: "test", credentials: "credentials" };
        Cookie.set(fetcher.authKey, JSON.stringify(credentials));
        fetcher.clearAuthCredentials();
        chai_1.expect(Cookie.get(fetcher.authKey)).to.equal(undefined);
    });
    describe("fetchOPDSData()", function () {
        it("throws error if response isn't 200", function () {
            var fetcher = new DataFetcher_1.default();
            fetcher.fetchOPDSData("test-url").catch(function (err) {
                chai_1.expect(err.status).to.equal(401);
                chai_1.expect(err.response).to.equal("unauthorized");
                chai_1.expect(err.url).to.equal("/test-url");
            });
        });
    });
});
