"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sinon_1 = require("sinon");
var DataFetcher_1 = require("../DataFetcher");
var MockDataFetcher = /** @class */ (function (_super) {
    __extends(MockDataFetcher, _super);
    function MockDataFetcher() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.resolve = true;
        _this.testData = "test";
        _this.testError = "test error";
        return _this;
    }
    MockDataFetcher.prototype.fetchOPDSData = function (url) {
        return this.fetch(url);
    };
    MockDataFetcher.prototype.fetchSearchDescriptionData = function (url) {
        return this.fetch(url);
    };
    MockDataFetcher.prototype.fetch = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            if (_this.resolve) {
                resolve(_this.testData);
            }
            else {
                reject(_this.testError);
            }
        });
    };
    MockDataFetcher.prototype.getAuthCredentials = function () {
        return { provider: "test", credentials: "credentials" };
    };
    return MockDataFetcher;
}(DataFetcher_1.default));
exports.default = MockDataFetcher;
MockDataFetcher.prototype.setAuthCredentials = sinon_1.stub();
MockDataFetcher.prototype.clearAuthCredentials = sinon_1.stub();
