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
var BookCover_1 = require("./BookCover");
var BorrowButton_1 = require("./BorrowButton");
var DownloadButton_1 = require("./DownloadButton");
var book_1 = require("../utils/book");
/** Displays a single book for use in a lane, list, or grid view. */
var Book = /** @class */ (function (_super) {
    __extends(Book, _super);
    function Book(props) {
        var _this = _super.call(this, props) || this;
        _this.borrow = _this.borrow.bind(_this);
        return _this;
    }
    Book.prototype.render = function () {
        var _a;
        var book = this.props.book;
        // Remove HTML tags from the summary to fit more information into a truncated view.
        // The summary may still contain HTML character entities and needs to be rendered as HTML.
        var summary = (book && book.summary && book.summary.replace(/<\/?[^>]+(>|$)/g, " ")) ||
            "";
        var bookMedium = book_1.getMedium(book);
        var showMediaIconClass = bookMedium ? "show-media" : "";
        var hasAuthors = !!(book.authors && book.authors.length);
        var hasContributors = !!(book.contributors && book.contributors.length);
        var contributors = book.contributors && book.contributors.length
            ? book.contributors.join(", ")
            : "";
        // Display contributors only if there are no authors.
        var authors = hasAuthors ? (_a = book.authors) === null || _a === void 0 ? void 0 : _a.join(", ") : contributors;
        return (React.createElement("div", { className: "book " + showMediaIconClass, lang: book.language },
            React.createElement(CatalogLink_1.default, { collectionUrl: this.props.collectionUrl, bookUrl: book.url || book.id, title: book.title },
                React.createElement(BookCover_1.default, { book: book }),
                React.createElement("div", { className: "compact-info " + showMediaIconClass },
                    book_1.getMediumSVG(bookMedium, false),
                    React.createElement("div", { className: "empty" }),
                    React.createElement("div", { className: "item-details" },
                        React.createElement("div", { className: "title" }, book.title),
                        book.series && book.series.name && (React.createElement("div", { className: "series" }, book.series.name)),
                        (hasAuthors || hasContributors) && (React.createElement("div", { className: "authors" },
                            React.createElement("span", null,
                                "By ",
                                authors)))))),
            React.createElement("div", { className: "expanded-info" },
                React.createElement("div", { className: "header" },
                    React.createElement("div", null,
                        React.createElement(CatalogLink_1.default, { collectionUrl: this.props.collectionUrl, bookUrl: book.url || book.id, title: book.title },
                            React.createElement("div", { className: "title" }, book.title)),
                        book.series && book.series.name && (React.createElement("div", { className: "series" }, book.series.name)),
                        (hasAuthors || hasContributors) && (React.createElement("div", { className: "authors" },
                            React.createElement("span", null,
                                "By ",
                                authors)))),
                    React.createElement("div", { className: "circulation-links" }, this.circulationLinks())),
                React.createElement("div", { className: "details" },
                    React.createElement("div", { className: "fields", lang: "en" },
                        bookMedium && React.createElement("span", null, book_1.getMediumSVG(bookMedium)),
                        this.fields().map(function (field, key) {
                            return field.value ? (React.createElement("div", { className: field.name.toLowerCase().replace(" ", "-"), key: "" + field.name },
                                field.name,
                                ": ",
                                field.value)) : null;
                        })),
                    React.createElement("div", { className: "summary", lang: book.language },
                        React.createElement("span", { dangerouslySetInnerHTML: { __html: summary } }),
                        React.createElement(CatalogLink_1.default, { collectionUrl: this.props.collectionUrl, bookUrl: book.url || book.id, title: book.title }, "\u2026 More"))))));
    };
    Book.prototype.fields = function () {
        return this.props.book
            ? [
                {
                    name: "Publisher",
                    value: this.props.book.publisher
                },
                {
                    name: "Published",
                    value: this.props.book.published
                },
                {
                    name: "Categories",
                    value: this.props.book.categories
                        ? this.props.book.categories.join(", ")
                        : null
                }
            ]
            : [];
    };
    Book.prototype.circulationLinks = function () {
        // Links are ordered so that the first link should be the most useful.
        // That way compact views can display only the first link.
        var _this = this;
        var _a, _b, _c;
        var links = [];
        if (book_1.bookIsOpenAccess(this.props.book)) {
            if (this.props.epubReaderUrlTemplate) {
                var index = 0;
                for (var _i = 0, _d = (_a = this.props.book.openAccessLinks, (_a !== null && _a !== void 0 ? _a : [])); _i < _d.length; _i++) {
                    var link = _d[_i];
                    if (link.type === "application/epub+zip") {
                        links.push(React.createElement("span", { key: link.url + "-" + index },
                            React.createElement("a", { className: "btn btn-default read-button", href: this.props.epubReaderUrlTemplate(link.url), target: "_blank" }, "Read Online")));
                        index++;
                    }
                }
            }
            (_b = this.props.book.openAccessLinks) === null || _b === void 0 ? void 0 : _b.forEach(function (link, index) {
                links.push(React.createElement(DownloadButton_1.default, { key: link.url + "-" + index, isPlainLink: true, link: link, title: _this.props.book.title }));
            });
        }
        else if (book_1.bookIsBorrowed(this.props.book)) {
            // Put streaming links first, followed by a disabled "Borrowed" button that will
            // display in the list view if streaming is not available.
            var streamingMediaType_1 = "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";
            var streamingLinks = [];
            var downloadLinks = [];
            for (var _e = 0, _f = (_c = this.props.book.fulfillmentLinks, (_c !== null && _c !== void 0 ? _c : [])); _e < _f.length; _e++) {
                var link = _f[_e];
                if (link.type === streamingMediaType_1 ||
                    link.indirectType === streamingMediaType_1) {
                    streamingLinks.push(link);
                }
                else {
                    downloadLinks.push(link);
                }
            }
            streamingLinks.forEach(function (link, index) {
                var isDirectStreaming = link.type === streamingMediaType_1;
                links.push(React.createElement(DownloadButton_1.default, { key: link.url + "-" + index, link: link, title: _this.props.book.title, isPlainLink: isDirectStreaming || !_this.props.isSignedIn }));
            });
            links.push(React.createElement(BorrowButton_1.default, { key: this.props.book.borrowUrl, className: "btn btn-default borrowed-button", disabled: true, borrow: this.borrow }, "Borrowed"));
            downloadLinks.forEach(function (link, index) {
                links.push(React.createElement(DownloadButton_1.default, { key: link.url + "-" + index, link: link, title: _this.props.book.title, isPlainLink: !_this.props.isSignedIn }));
            });
        }
        if (book_1.bookIsReserved(this.props.book)) {
            links.push(React.createElement("button", { key: "onhold", className: "btn btn-default disabled" }, "Reserved"));
        }
        else if (!book_1.bookIsBorrowed(this.props.book) && this.props.book.borrowUrl) {
            var label = !book_1.bookIsReady(this.props.book) &&
                this.props.book.copies &&
                this.props.book.copies.available === 0
                ? "Reserve"
                : "Borrow";
            links.push(React.createElement(BorrowButton_1.default, { key: this.props.book.borrowUrl, borrow: this.borrow }, label));
        }
        return links;
    };
    Book.prototype.borrow = function () {
        return this.props.updateBook(this.props.book.borrowUrl);
    };
    return Book;
}(React.Component));
exports.default = Book;
