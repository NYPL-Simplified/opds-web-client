"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utilities for dealing with redux state.
 */
function loanedBookData(book, loans, bookUrl) {
    if (!loans || loans.length === 0) {
        return book;
    }
    var loan = loans.find(function (loanedBook) {
        if (book) {
            return loanedBook.id === book.id;
        }
        else if (bookUrl) {
            return loanedBook.url === bookUrl;
        }
        else {
            return false;
        }
    });
    return loan || book;
}
exports.loanedBookData = loanedBookData;
function collectionDataWithLoans(collectionData, loans) {
    var _a, _b;
    // If any books in the collection are in the loans feed, replace them with their
    // loaned version. This currently only changes ungrouped books, not books in lanes,
    // since lanes don't need any loan-related information.
    return Object.assign({}, collectionData, {
        books: (_b = (_a = collectionData) === null || _a === void 0 ? void 0 : _a.books) === null || _b === void 0 ? void 0 : _b.map(function (book) { return loanedBookData(book, loans); })
    });
}
exports.collectionDataWithLoans = collectionDataWithLoans;
