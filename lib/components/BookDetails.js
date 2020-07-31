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
var moment = require("moment");
var BookCover_1 = require("./BookCover");
var Book_1 = require("./Book");
var book_1 = require("../utils/book");
/** Detail page for a single book. */
var BookDetails = /** @class */ (function (_super) {
    __extends(BookDetails, _super);
    function BookDetails() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BookDetails.prototype.render = function () {
        var _a;
        var fields = this.fields();
        var medium = book_1.getMedium(this.props.book);
        return (React.createElement("div", { className: "book-details" },
            React.createElement("div", { className: "top", lang: this.props.book.language },
                React.createElement("div", { className: "cover" },
                    React.createElement(BookCover_1.default, { book: this.props.book })),
                React.createElement("div", { className: "details" },
                    React.createElement("h1", { className: "title" }, this.props.book.title),
                    this.props.book.subtitle && (React.createElement("p", { className: "subtitle" }, this.props.book.subtitle)),
                    this.props.book.series && this.props.book.series.name && (React.createElement("p", { className: "series" }, this.props.book.series.name)),
                    this.props.book.authors && this.props.book.authors.length > 0 && (React.createElement("p", { className: "authors" },
                        "By ",
                        this.props.book.authors.join(", "))),
                    this.props.book.contributors &&
                        this.props.book.contributors.length > 0 && (React.createElement("p", { className: "contributors" },
                        "Contributors: ",
                        this.props.book.contributors.join(", "))),
                    React.createElement("ul", { className: "fields", lang: "en" },
                        fields.map(function (field) {
                            return field.value && (React.createElement("li", { className: field.name.toLowerCase().replace(" ", "-"), key: field.name },
                                field.name,
                                ": ",
                                field.value));
                        }),
                        medium && (React.createElement("li", { className: "item-icon-container" }, book_1.getMediumSVG(medium)))))),
            React.createElement("div", { className: "divider" }),
            React.createElement("div", { className: "main" },
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "top col-sm-6 col-sm-offset-3" },
                        React.createElement("div", { className: "circulation-links" }, this.circulationLinks()),
                        React.createElement("div", { className: "circulation-info" }, this.circulationInfo())),
                    React.createElement("div", { className: "right-column-links col-sm-3" }, this.rightColumnLinks())),
                React.createElement("h2", null, "Summary"),
                React.createElement("div", { className: "summary", lang: this.props.book.language, dangerouslySetInnerHTML: { __html: (_a = this.props.book.summary, (_a !== null && _a !== void 0 ? _a : "")) } }))));
    };
    BookDetails.prototype.componentDidMount = function () {
        this.setBodyOverflow("hidden");
    };
    BookDetails.prototype.componentWillUnmount = function () {
        this.setBodyOverflow("visible");
    };
    BookDetails.prototype.setBodyOverflow = function (value) {
        var elem = document.getElementsByTagName("body")[0];
        if (elem) {
            elem.style.overflow = value;
        }
    };
    BookDetails.prototype.circulationInfo = function () {
        if (book_1.bookIsOpenAccess(this.props.book)) {
            return [
                React.createElement("div", { key: "oa", className: "open-access-info" }, "This open-access book is available to keep.")
            ];
        }
        if (book_1.bookIsBorrowed(this.props.book)) {
            var availableUntil = this.props.book.availability && this.props.book.availability.until;
            if (availableUntil) {
                var timeLeft = moment(availableUntil).fromNow(true);
                return [
                    React.createElement("div", { key: "loan", className: "loan-info" },
                        "You have this book on loan for ",
                        timeLeft,
                        ".")
                ];
            }
            return [];
        }
        var info = [];
        var availableCopies = this.props.book.copies && this.props.book.copies.available;
        var totalCopies = this.props.book.copies && this.props.book.copies.total;
        var totalHolds = this.props.book.holds && this.props.book.holds.total;
        var holdsPosition = this.props.book.holds && this.props.book.holds.position;
        if (availableCopies !== undefined &&
            availableCopies !== null &&
            totalCopies !== undefined &&
            totalCopies !== null) {
            info.push(React.createElement("div", { key: "copies", className: "copies-info" },
                availableCopies,
                " of ",
                totalCopies,
                " copies available"));
        }
        if (totalHolds && availableCopies === 0) {
            info.push(React.createElement("div", { key: "holds", className: "holds-info" },
                totalHolds,
                " patrons in hold queue"));
            if (book_1.bookIsReserved(this.props.book) &&
                holdsPosition !== undefined &&
                holdsPosition !== null) {
                info.push(React.createElement("div", { key: "holds-position", className: "holds-info" },
                    "Your holds position: ",
                    holdsPosition));
            }
        }
        return info;
    };
    /**
     * rightColumnLinks
     * Not used in this app but can be overridden to add links on the
     * right column, such as adding links to report a problem.
     */
    BookDetails.prototype.rightColumnLinks = function () { };
    return BookDetails;
}(Book_1.default));
exports.default = BookDetails;
