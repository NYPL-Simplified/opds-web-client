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
var Book_1 = require("./Book");
var CatalogLink_1 = require("./CatalogLink");
var LaneMoreLink_1 = require("./LaneMoreLink");
/** Shows one scrollable lane in a collection. */
var Lane = /** @class */ (function (_super) {
    __extends(Lane, _super);
    function Lane(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { atLeft: true, atRight: false };
        _this.scrollBack = _this.scrollBack.bind(_this);
        _this.scrollForward = _this.scrollForward.bind(_this);
        _this.updateScrollButtons = _this.updateScrollButtons.bind(_this);
        return _this;
    }
    Lane.prototype.render = function () {
        var _this = this;
        var visibleBooks = this.visibleBooks();
        if (visibleBooks.length === 0) {
            return null;
        }
        return (React.createElement("div", { className: "lane" },
            React.createElement("h2", null,
                React.createElement(CatalogLink_1.default, { className: "title", collectionUrl: this.props.lane.url }, this.props.lane.title)),
            React.createElement("div", { ref: "container", className: "lane-books-container" },
                !this.state.atLeft && (React.createElement("button", { className: "scroll-button left", "aria-label": "Scroll back in " + this.props.lane.title, onClick: this.scrollBack }, "\u25C1")),
                React.createElement("ul", { ref: "list", className: "lane-books", "aria-label": "books in " + this.props.lane.title },
                    visibleBooks.map(function (book, index) { return (React.createElement("li", { key: index },
                        React.createElement(Book_1.default, { book: book, collectionUrl: _this.props.collectionUrl, updateBook: _this.props.updateBook, isSignedIn: _this.props.isSignedIn, epubReaderUrlTemplate: _this.props.epubReaderUrlTemplate }))); }),
                    !this.props.hideMoreLink && (React.createElement("li", { key: "more" },
                        React.createElement(LaneMoreLink_1.default, { lane: this.props.lane })))),
                !this.state.atRight && (React.createElement("button", { className: "scroll-button right", "aria-label": "Scroll forward in " + this.props.lane.title, onClick: this.scrollForward }, "\u25B7")))));
    };
    Lane.prototype.visibleBooks = function () {
        var _this = this;
        if (!this.props.hiddenBookIds) {
            return this.props.lane.books;
        }
        return this.props.lane.books.filter(
        // the following optional chaining will ensure it evaluates to false if
        // hiddenBookIds is undefined
        function (book) { var _a; return ((_a = _this.props.hiddenBookIds) === null || _a === void 0 ? void 0 : _a.indexOf(book.id)) === -1; });
    };
    Lane.prototype.getContainerWidth = function () {
        return this.refs["container"].clientWidth;
    };
    Lane.prototype.getScrollWidth = function () {
        return this.refs["list"].scrollWidth;
    };
    Lane.prototype.getScroll = function () {
        return this.refs["list"].scrollLeft;
    };
    Lane.prototype.changeScroll = function (delta) {
        var _this = this;
        var oldScroll = this.getScroll();
        var newScroll = oldScroll + delta;
        var scrollWidth = this.getScrollWidth();
        var containerWidth = this.getContainerWidth();
        if (newScroll > scrollWidth - containerWidth) {
            newScroll = scrollWidth - containerWidth;
        }
        if (newScroll < 0) {
            newScroll = 0;
        }
        var increment = 25;
        if (delta < 0) {
            increment = increment * -1;
        }
        var animationFrame;
        var incrementScroll = function (time) {
            var scroll = _this.getScroll();
            var remainingScroll = newScroll - scroll;
            var list = _this.refs["list"];
            if (Math.abs(remainingScroll) < Math.abs(increment)) {
                list.scrollLeft = newScroll;
                window.cancelAnimationFrame(animationFrame);
            }
            else {
                list.scrollLeft = scroll + increment;
                animationFrame = window.requestAnimationFrame(incrementScroll);
            }
        };
        animationFrame = window.requestAnimationFrame(incrementScroll);
    };
    Lane.prototype.scrollBack = function () {
        var containerWidth = this.getContainerWidth();
        var delta = -containerWidth + 50;
        this.changeScroll(delta);
    };
    Lane.prototype.scrollForward = function () {
        var containerWidth = this.getContainerWidth();
        var delta = containerWidth - 50;
        this.changeScroll(delta);
    };
    Lane.prototype.updateScrollButtons = function () {
        var atLeft = false;
        var atRight = false;
        var scroll = this.getScroll();
        var scrollWidth = this.getScrollWidth();
        var containerWidth = this.getContainerWidth();
        if (scroll <= 0) {
            atLeft = true;
        }
        if (scroll >= scrollWidth - containerWidth) {
            atRight = true;
        }
        this.setState({ atLeft: atLeft, atRight: atRight });
    };
    Lane.prototype.componentDidMount = function () {
        var list = this.refs["list"];
        if (list) {
            list.addEventListener("scroll", this.updateScrollButtons);
            window.addEventListener("resize", this.updateScrollButtons);
            this.updateScrollButtons();
        }
    };
    Lane.prototype.componentWillUnmount = function () {
        var list = this.refs["list"];
        if (list) {
            list.removeEventListener("scroll", this.updateScrollButtons);
            window.removeEventListener("resize", this.updateScrollButtons);
        }
    };
    return Lane;
}(React.Component));
exports.default = Lane;
