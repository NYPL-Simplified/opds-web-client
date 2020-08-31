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
var seedrandom = require("seedrandom");
/** Shows a cover image from the OPDS feed or an automatically generated cover for
    a single book. */
var BookCover = /** @class */ (function (_super) {
    __extends(BookCover, _super);
    function BookCover(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { error: false };
        _this.handleError = _this.handleError.bind(_this);
        return _this;
    }
    BookCover.prototype.handleError = function (event) {
        this.setState({ error: true });
    };
    BookCover.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.state.error) {
            this.setState({ error: false });
        }
    };
    BookCover.prototype.render = function () {
        var _a, _b, _c;
        var _d = this.props.book, title = _d.title, authors = _d.authors, imageUrl = _d.imageUrl;
        if (imageUrl && !this.state.error) {
            return (React.createElement("img", { src: imageUrl, onError: this.handleError, className: "book-cover", role: "presentation", alt: "" }));
        }
        var titleFontSize = this.computeFontSize(title, 40);
        var authorFontSize = this.computeFontSize((_b = (_a = authors) === null || _a === void 0 ? void 0 : _a.join(", "), (_b !== null && _b !== void 0 ? _b : "")), 25);
        var hue = this.seededRandomHue(title);
        var bgColor = "hsla(" + hue + ", 40%, 60%, 1)";
        return (React.createElement("div", { className: "auto-book-cover", style: { backgroundColor: bgColor } },
            React.createElement("div", { className: "title", style: { fontSize: titleFontSize } }, title),
            ((_c = authors) === null || _c === void 0 ? void 0 : _c.length) && (React.createElement("div", { className: "authors", style: { fontSize: authorFontSize } },
                "By ",
                authors.join(", ")))));
    };
    BookCover.prototype.computeFontSize = function (text, baseFontSize, minFontSize) {
        if (baseFontSize === void 0) { baseFontSize = 40; }
        if (minFontSize === void 0) { minFontSize = 15; }
        // decrease size as max word length increases
        // decrease size as word count grows beyond 3
        var words = text.split(/\s/);
        var wordCount = words.length;
        var maxLength = Math.max.apply(Math, words.map(function (word) { return word.length; }));
        var fontSize = Math.max(minFontSize, baseFontSize - maxLength * 2 - Math.max(0, wordCount - 3) * 2);
        return fontSize / 13 + "em";
    };
    BookCover.prototype.seededRandomHue = function (seed) {
        return Math.round(360 * seedrandom(seed)());
    };
    return BookCover;
}(React.Component));
exports.default = BookCover;
