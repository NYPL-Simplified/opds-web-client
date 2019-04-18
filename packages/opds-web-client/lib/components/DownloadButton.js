"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var download_1 = require("./download");
/** Shows a button to fulfill and download a book or download it directly. */
var DownloadButton = /** @class */ (function (_super) {
    __extends(DownloadButton, _super);
    function DownloadButton(props) {
        var _this = _super.call(this, props) || this;
        _this.fulfill = _this.fulfill.bind(_this);
        return _this;
    }
    DownloadButton.prototype.render = function () {
        var props = JSON.parse(JSON.stringify(this.props));
        delete props["url"];
        delete props["mimeType"];
        delete props["isPlainLink"];
        delete props["fulfill"];
        delete props["indirectFulfill"];
        delete props["indirectType"];
        delete props["title"];
        return (React.createElement("span", null, this.props.isPlainLink ?
            React.createElement("a", __assign({ className: "btn btn-default download-button" }, props, { href: this.props.url, target: "_blank" }), this.downloadLabel()) :
            React.createElement("button", __assign({ className: "btn btn-default download-button download-" + this.fileExtension().slice(1) + "-button" }, props, { onClick: this.fulfill }), this.downloadLabel())));
    };
    DownloadButton.prototype.fulfill = function () {
        var _this = this;
        if (this.isIndirect()) {
            return this.props.indirectFulfill(this.props.url, this.props.indirectType).then(function (url) {
                window.open(url, "_blank");
            });
        }
        else {
            return this.props.fulfill(this.props.url).then(function (blob) {
                download_1.default(blob, _this.generateFilename(_this.props.title), 
                // TODO: use mimeType variable once we fix the link type in our OPDS entries
                _this.mimeType());
            });
        }
    };
    DownloadButton.prototype.isIndirect = function () {
        return this.props.indirectType &&
            this.props.mimeType === "application/atom+xml;type=entry;profile=opds-catalog";
    };
    DownloadButton.prototype.generateFilename = function (str) {
        return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + this.fileExtension();
    };
    DownloadButton.prototype.mimeType = function () {
        return this.props.mimeType === "vnd.adobe/adept+xml" ? "application/vnd.adobe.adept+xml" : this.props.mimeType;
    };
    DownloadButton.prototype.fileExtension = function () {
        return {
            "application/epub+zip": ".epub",
            "application/pdf": ".pdf",
            "application/vnd.adobe.adept+xml": ".acsm",
            "application/x-mobipocket-ebook": ".mobi"
        }[this.mimeType()] || "";
    };
    DownloadButton.prototype.downloadLabel = function () {
        if (this.props.indirectType === "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media") {
            return "Read Online";
        }
        var type = this.fileExtension().replace(".", "").toUpperCase();
        return "Download" + (type ? " " + type : "");
    };
    return DownloadButton;
}(React.Component));
exports.default = DownloadButton;
