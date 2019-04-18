"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var opds_feed_parser_1 = require("opds-feed-parser");
var OpenSearchDescriptionParser_1 = require("./OpenSearchDescriptionParser");
var Cookie = require("js-cookie");
require("isomorphic-fetch");
/** Handles requests to OPDS servers. */
var DataFetcher = /** @class */ (function () {
    function DataFetcher(config) {
        if (config === void 0) { config = {}; }
        this.proxyUrl = config.proxyUrl;
        this.adapter = config.adapter;
        this.authKey = "authCredentials";
    }
    DataFetcher.prototype.fetchOPDSData = function (url) {
        var _this = this;
        var parser = new opds_feed_parser_1.default;
        return new Promise(function (resolve, reject) {
            _this.fetch(url).then(function (response) {
                response.text().then(function (text) {
                    if (_this.isErrorCode(response.status)) {
                        reject({
                            status: response.status,
                            response: text,
                            url: url,
                            headers: response.headers
                        });
                    }
                    parser.parse(text).then(function (parsedData) {
                        resolve(_this.adapter(parsedData, url));
                    }).catch(function (err) {
                        reject({
                            status: null,
                            response: "Failed to parse OPDS data",
                            url: url
                        });
                    });
                });
            }).catch(reject);
        });
    };
    DataFetcher.prototype.fetchSearchDescriptionData = function (searchDescriptionUrl) {
        var _this = this;
        var parser = new OpenSearchDescriptionParser_1.default;
        return new Promise(function (resolve, reject) {
            _this.fetch(searchDescriptionUrl).then(function (response) {
                response.text().then(function (text) {
                    if (_this.isErrorCode(response.status)) {
                        reject({
                            status: response.status,
                            response: text,
                            url: searchDescriptionUrl
                        });
                    }
                    parser.parse(text, searchDescriptionUrl).then(function (openSearchDescription) {
                        resolve(openSearchDescription);
                    }).catch(function (err) {
                        reject({
                            status: null,
                            response: "Failed to parse OPDS data",
                            url: searchDescriptionUrl
                        });
                    });
                });
            }).catch(reject);
        });
    };
    DataFetcher.prototype.fetch = function (url, options) {
        if (options === void 0) { options = {}; }
        options = Object.assign({ credentials: "same-origin" }, options);
        if (this.proxyUrl) {
            var formData = new window.FormData();
            formData.append("url", url);
            Object.assign(options, {
                method: "POST",
                body: formData
            });
            url = this.proxyUrl;
        }
        options["headers"] = this.prepareAuthHeaders(options["headers"]);
        return fetch(url, options);
    };
    DataFetcher.prototype.setAuthCredentials = function (credentials) {
        if (credentials) {
            Cookie.set(this.authKey, JSON.stringify(credentials));
        }
    };
    DataFetcher.prototype.getAuthCredentials = function () {
        var credentials = Cookie.get(this.authKey);
        if (credentials) {
            return JSON.parse(credentials);
        }
    };
    DataFetcher.prototype.clearAuthCredentials = function () {
        Cookie.remove(this.authKey);
    };
    DataFetcher.prototype.prepareAuthHeaders = function (headers) {
        if (headers === void 0) { headers = {}; }
        // server needs to know request came from JS in order to omit
        // 'Www-Authenticate: Basic' header, which triggers browser's
        // ugly basic auth popup
        headers["X-Requested-With"] = "XMLHttpRequest";
        var credentials = this.getAuthCredentials();
        if (credentials) {
            headers["Authorization"] = credentials.credentials;
        }
        return headers;
    };
    DataFetcher.prototype.isErrorCode = function (status) {
        return status < 200 || status >= 400;
    };
    return DataFetcher;
}());
exports.default = DataFetcher;
