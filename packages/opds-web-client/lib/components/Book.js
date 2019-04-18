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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var CatalogLink_1 = require("./CatalogLink");
var BookCover_1 = require("./BookCover");
var BorrowButton_1 = require("./BorrowButton");
var DownloadButton_1 = require("./DownloadButton");
var dgx_svg_icons_1 = require("@nypl/dgx-svg-icons");
var download = require("downloadjs");
/** Displays a single book for use in a lane, list, or grid view. */
var Book = /** @class */ (function (_super) {
    __extends(Book, _super);
    function Book(props) {
        var _this = _super.call(this, props) || this;
        _this.borrow = _this.borrow.bind(_this);
        return _this;
    }
    Book.prototype.render = function () {
        var book = this.props.book;
        // Remove HTML tags from the summary to fit more information into a truncated view.
        // The summary may still contain HTML character entities and needs to be rendered as HTML.
        var summary = (book && book.summary && book.summary.replace(/<\/?[^>]+(>|$)/g, " ")) || "";
        var bookMedium = this.getMedium(book);
        var showMediaIconClass = bookMedium ? "show-media" : "";
        var hasAuthors = !!(book.authors && book.authors.length);
        var hasContributors = !!(book.contributors && book.contributors.length);
        var contributors = book.contributors && book.contributors.length ?
            book.contributors.join(", ") :
            "";
        // Display contributors only if there are no authors.
        var authors = hasAuthors ? book.authors.join(", ") : contributors;
        return (React.createElement("div", { className: "book " + showMediaIconClass, lang: book.language },
            React.createElement(CatalogLink_1.default, { collectionUrl: this.props.collectionUrl, bookUrl: book.url || book.id, title: book.title },
                React.createElement(BookCover_1.default, { book: book }),
                React.createElement("div", { className: "compact-info " + showMediaIconClass },
                    this.getMediumSVG(bookMedium, false),
                    React.createElement("div", { className: "empty" }),
                    React.createElement("div", { className: "item-details" },
                        React.createElement("div", { className: "title" }, book.title),
                        book.series && book.series.name &&
                            React.createElement("div", { className: "series" }, book.series.name),
                        (hasAuthors || hasContributors) &&
                            React.createElement("div", { className: "authors" },
                                React.createElement("span", null,
                                    "By ",
                                    authors))))),
            React.createElement("div", { className: "expanded-info" },
                React.createElement("div", { className: "header" },
                    React.createElement("div", null,
                        React.createElement(CatalogLink_1.default, { collectionUrl: this.props.collectionUrl, bookUrl: book.url || book.id, title: book.title },
                            React.createElement("div", { className: "title" }, book.title)),
                        book.series && book.series.name &&
                            React.createElement("div", { className: "series" }, book.series.name),
                        (hasAuthors || hasContributors) &&
                            React.createElement("div", { className: "authors" },
                                React.createElement("span", null,
                                    "By ",
                                    authors))),
                    React.createElement("div", { className: "circulation-links" }, this.circulationLinks())),
                React.createElement("div", { className: "details" },
                    React.createElement("div", { className: "fields", lang: "en" },
                        bookMedium && (React.createElement("span", null, this.getMediumSVG(bookMedium))),
                        this.fields().map(function (field) {
                            return field.value ? React.createElement("div", { className: field.name.toLowerCase().replace(" ", "-"), key: field.name },
                                field.name,
                                ": ",
                                field.value) : null;
                        })),
                    React.createElement("div", { className: "summary", lang: book.language },
                        React.createElement("span", { dangerouslySetInnerHTML: { __html: summary } }),
                        React.createElement(CatalogLink_1.default, { collectionUrl: this.props.collectionUrl, bookUrl: book.url || book.id, title: book.title }, "\u2026 More"))))));
    };
    Book.prototype.fields = function () {
        return this.props.book ? [
            {
                name: "Publisher",
                value: this.props.book.publisher
            },
            {
                name: "Published",
                "value": this.props.book.published
            },
            {
                name: "Categories",
                value: this.props.book.categories ?
                    this.props.book.categories.join(", ") :
                    null
            }
        ] : [];
    };
    Book.prototype.circulationLinks = function () {
        // Links are ordered so that the first link should be the most useful.
        // That way compact views can display only the first link.
        var _this = this;
        var links = [];
        if (this.isOpenAccess()) {
            if (this.props.epubReaderUrlTemplate) {
                for (var _i = 0, _a = this.props.book.openAccessLinks; _i < _a.length; _i++) {
                    var link = _a[_i];
                    if (link.type === "application/epub+zip") {
                        links.push(React.createElement("span", { key: link.url },
                            React.createElement("a", { className: "btn btn-default read-button", href: this.props.epubReaderUrlTemplate(link.url), target: "_blank" }, "Read Online")));
                    }
                }
            }
            links.push(this.props.book.openAccessLinks.map(function (link) {
                return (React.createElement(DownloadButton_1.default, { key: link.url, url: link.url, mimeType: link.type, isPlainLink: true }));
            }));
        }
        else if (this.isBorrowed()) {
            // Put streaming links first, followed by a disabled "Borrowed" button that will
            // display in the list view if streaming is not available.
            var streamingMediaType_1 = "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";
            var streamingLinks = [];
            var downloadLinks = [];
            for (var _b = 0, _c = this.props.book.fulfillmentLinks; _b < _c.length; _b++) {
                var link = _c[_b];
                if (link.type === streamingMediaType_1 || link.indirectType === streamingMediaType_1) {
                    streamingLinks.push(link);
                }
                else {
                    downloadLinks.push(link);
                }
            }
            links.push(streamingLinks.map(function (link) {
                var isDirectStreaming = link.type === streamingMediaType_1;
                return (React.createElement(DownloadButton_1.default, { key: link.url, fulfill: _this.props.fulfillBook, indirectFulfill: _this.props.indirectFulfillBook, url: link.url, mimeType: link.type, title: _this.props.book.title, isPlainLink: isDirectStreaming || !_this.props.isSignedIn, indirectType: link.indirectType }));
            }));
            links.push(React.createElement(BorrowButton_1.default, { key: this.props.book.borrowUrl, className: "btn btn-default borrowed-button", disabled: true, borrow: this.borrow }, "Borrowed"));
            links.push(downloadLinks.map(function (link) {
                return (React.createElement(DownloadButton_1.default, { key: link.url, fulfill: _this.props.fulfillBook, indirectFulfill: _this.props.indirectFulfillBook, url: link.url, mimeType: link.type, title: _this.props.book.title, isPlainLink: !_this.props.isSignedIn, indirectType: link.indirectType }));
            }));
        }
        if (this.isReserved()) {
            links.push(React.createElement("button", { key: "onhold", className: "btn btn-default disabled" }, "Reserved"));
        }
        else if (!this.isBorrowed() && this.props.book.borrowUrl) {
            var label = !this.isReady() &&
                this.props.book.copies &&
                this.props.book.copies.available === 0 ?
                "Reserve" :
                "Borrow";
            links.push(React.createElement(BorrowButton_1.default, { key: this.props.book.borrowUrl, borrow: this.borrow }, label));
        }
        return links;
    };
    Book.prototype.getMedium = function (book) {
        if (!book.raw || !book.raw["$"] || !book.raw["$"]["schema:additionalType"]) {
            return "";
        }
        return book.raw["$"]["schema:additionalType"].value ?
            book.raw["$"]["schema:additionalType"].value : "";
    };
    Book.prototype.getMediumSVG = function (medium, displayLabel) {
        if (displayLabel === void 0) { displayLabel = true; }
        if (!medium) {
            return null;
        }
        var svgMediumTypes = {
            "http://bib.schema.org/Audiobook": {
                element: React.createElement(dgx_svg_icons_1.AudioHeadphoneIcon, { ariaHidden: true, title: "Audio/Headphone Icon" }),
                label: "Audio",
            },
            "http://schema.org/EBook": {
                element: React.createElement(dgx_svg_icons_1.BookIcon, { ariaHidden: true, title: "eBook Icon" }),
                label: "eBook",
            },
            "http://schema.org/Book": {
                element: React.createElement(dgx_svg_icons_1.BookIcon, { ariaHidden: true, title: "eBook Icon" }),
                label: "eBook",
            },
        };
        var svgElm = svgMediumTypes[medium];
        return svgElm ?
            (React.createElement("div", { className: "item-icon" },
                svgElm.element,
                " ",
                displayLabel ? svgElm.label : null))
            : null;
    };
    Book.prototype.borrow = function () {
        return this.props.updateBook(this.props.book.borrowUrl);
    };
    Book.prototype.isReserved = function () {
        return this.props.book.availability &&
            this.props.book.availability.status === "reserved";
    };
    Book.prototype.isReady = function () {
        return this.props.book.availability &&
            this.props.book.availability.status === "ready";
    };
    Book.prototype.isBorrowed = function () {
        return this.props.book.fulfillmentLinks &&
            this.props.book.fulfillmentLinks.length > 0;
    };
    Book.prototype.isOpenAccess = function () {
        return this.props.book.openAccessLinks &&
            this.props.book.openAccessLinks.length > 0;
    };
    return Book;
}(React.Component));
exports.default = Book;
