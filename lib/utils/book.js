"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var dgx_svg_icons_1 = require("@nypl/dgx-svg-icons");
/**
 *  A collection of utils for processing book data
 */
function bookIsReserved(book) {
    var _a;
    return ((_a = book.availability) === null || _a === void 0 ? void 0 : _a.status) === "reserved";
}
exports.bookIsReserved = bookIsReserved;
function bookIsReady(book) {
    var _a;
    return ((_a = book.availability) === null || _a === void 0 ? void 0 : _a.status) === "ready";
}
exports.bookIsReady = bookIsReady;
function bookIsBorrowed(book) {
    var _a, _b;
    return (_b = (_a = book.fulfillmentLinks) === null || _a === void 0 ? void 0 : _a.length, (_b !== null && _b !== void 0 ? _b : 0)) > 0;
}
exports.bookIsBorrowed = bookIsBorrowed;
function bookIsOpenAccess(book) {
    var _a, _b;
    return (_b = (_a = book.openAccessLinks) === null || _a === void 0 ? void 0 : _a.length, (_b !== null && _b !== void 0 ? _b : 0)) > 0;
}
exports.bookIsOpenAccess = bookIsOpenAccess;
function bookIsBorrowable(book) {
    return typeof book.borrowUrl === "string";
}
exports.bookIsBorrowable = bookIsBorrowable;
function getMedium(book) {
    if (!book.raw || !book.raw["$"] || !book.raw["$"]["schema:additionalType"]) {
        return "";
    }
    return book.raw["$"]["schema:additionalType"].value
        ? book.raw["$"]["schema:additionalType"].value
        : "";
}
exports.getMedium = getMedium;
exports.bookMediumSvgMap = {
    "http://bib.schema.org/Audiobook": {
        element: React.createElement(dgx_svg_icons_1.AudioHeadphoneIcon, { ariaHidden: true, title: "Audio/Headphone Icon" }),
        label: "Audio"
    },
    "http://schema.org/EBook": {
        element: React.createElement(dgx_svg_icons_1.BookIcon, { ariaHidden: true, title: "eBook Icon" }),
        label: "eBook"
    },
    "http://schema.org/Book": {
        element: React.createElement(dgx_svg_icons_1.BookIcon, { ariaHidden: true, title: "eBook Icon" }),
        label: "eBook"
    }
};
function getMediumSVG(medium, displayLabel) {
    if (displayLabel === void 0) { displayLabel = true; }
    if (!medium || Object.keys(exports.bookMediumSvgMap).indexOf(medium) === -1) {
        return null;
    }
    var svgElm = exports.bookMediumSvgMap[medium];
    return (React.createElement("div", { className: "item-icon" },
        svgElm.element,
        " ",
        displayLabel ? svgElm.label : null));
}
exports.getMediumSVG = getMediumSVG;
