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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var useDownloadButton_1 = require("../hooks/useDownloadButton");
var DownloadButton = function (props) {
    var ref = props.ref, isPlainLink = props.isPlainLink, link = props.link, title = props.title, elementProps = __rest(props, ["ref", "isPlainLink", "link", "title"]);
    var _a = useDownloadButton_1.default(link, title), mimeType = _a.mimeType, fulfill = _a.fulfill, downloadLabel = _a.downloadLabel, fileExtension = _a.fileExtension;
    var baseClassName = "btn btn-default download-button";
    var buttonClassName = baseClassName + " download-" + fileExtension.slice(1) + "-button";
    return (React.createElement("span", null, isPlainLink ? (React.createElement("a", __assign({ href: link.url, target: "_blank" }, elementProps, { className: baseClassName }), downloadLabel)) : (React.createElement("button", __assign({ onClick: fulfill }, elementProps, { className: buttonClassName }), downloadLabel))));
};
exports.default = DownloadButton;
