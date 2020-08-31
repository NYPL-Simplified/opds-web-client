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
var React = require("react");
var CatalogLink_1 = require("./CatalogLink");
/** The link at the far right of a lane that goes to the full feed for that lane. */
var LaneMoreLink = /** @class */ (function (_super) {
    __extends(LaneMoreLink, _super);
    function LaneMoreLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LaneMoreLink.prototype.render = function () {
        var fontSize = this.computeFontSize();
        return (React.createElement("div", { className: "book" },
            React.createElement(CatalogLink_1.default, { className: "more-link", collectionUrl: this.props.lane.url },
                React.createElement("div", { style: { fontSize: fontSize } },
                    "More",
                    React.createElement("br", null),
                    this.props.lane.title))));
    };
    LaneMoreLink.prototype.computeFontSize = function () {
        var words = this.props.lane.title.split(/\s/);
        var wordCount = words.length;
        var maxLength = Math.max.apply(Math, words.map(function (word) { return word.length; }));
        var fontSize = Math.max(15, 43 - maxLength * 2 - Math.max(0, wordCount - 3) * 2);
        return fontSize + "px";
    };
    return LaneMoreLink;
}(React.Component));
exports.default = LaneMoreLink;
