"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
var initialState = {
    url: null,
    books: []
};
exports.default = (function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case actions_1.default.COLLECTION_LOAD:
            var loansUrl = action.data.shelfUrl || state.url;
            var isLoans = action.url === loansUrl;
            return Object.assign({}, state, {
                url: action.data.shelfUrl || state.url,
                books: isLoans ? action.data.books : state.books
            });
        case actions_1.default.LOANS_LOAD:
            return Object.assign({}, state, {
                books: action.data.books
            });
        case actions_1.default.CLEAR_AUTH_CREDENTIALS:
            // Clear auth credentials should remove the authenticated
            // user's loans as well.
            return Object.assign({}, state, {
                books: []
            });
        case actions_1.default.UPDATE_BOOK_LOAD:
            // A book has been updated, so the loans feed is now outdated.
            var updatedBook = action.data;
            var isReserved = (updatedBook.availability && updatedBook.availability.status === "reserved");
            var isBorrowed = (updatedBook.fulfillmentLinks && updatedBook.fulfillmentLinks.length > 0);
            var newLoans = [];
            // Copy over all the books except the updated one.
            for (var _i = 0, _a = state.books; _i < _a.length; _i++) {
                var loan = _a[_i];
                if (loan.id !== updatedBook.id) {
                    newLoans.push(loan);
                }
            }
            // If the updated book should be in the loans, add it.
            if (isReserved || isBorrowed) {
                newLoans.push(updatedBook);
            }
            return Object.assign({}, state, {
                books: newLoans
            });
        default:
            return state;
    }
});
