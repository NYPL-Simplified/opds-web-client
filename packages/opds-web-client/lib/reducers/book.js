"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
var initialState = {
    url: null,
    data: null,
    isFetching: false,
    error: null
};
var book = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case actions_1.default.BOOK_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                error: null
            });
        case actions_1.default.BOOK_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        case actions_1.default.BOOK_LOAD:
            return Object.assign({}, state, {
                data: action.data,
                url: action.url ? action.url : state.url,
                isFetching: false
            });
        case actions_1.default.BOOK_CLEAR:
            return Object.assign({}, state, {
                data: null,
                url: null,
                error: null
            });
        case actions_1.default.CLOSE_ERROR:
            return Object.assign({}, state, {
                error: null
            });
        case actions_1.default.FULFILL_BOOK_REQUEST:
        case actions_1.default.UPDATE_BOOK_REQUEST:
            return Object.assign({}, state, {
                isFetching: true
            });
        case actions_1.default.FULFILL_BOOK_SUCCESS:
        case actions_1.default.UPDATE_BOOK_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false
            });
        case actions_1.default.FULFILL_BOOK_FAILURE:
        case actions_1.default.UPDATE_BOOK_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        case actions_1.default.UPDATE_BOOK_LOAD:
            // We might update a book when no book was in the state, for example
            // when borrowing a book from a collection page. In that case,
            // we shouldn't add the book to the state.
            if (state.data === null) {
                return state;
            }
            // If a book was in the state already, we should replace it on update.
            return Object.assign({}, state, {
                data: Object.assign({}, state.data, action.data)
            });
        default:
            return state;
    }
};
exports.default = book;
