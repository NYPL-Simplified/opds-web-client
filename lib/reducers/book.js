"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
            return __assign(__assign({}, state), { isFetching: true, error: null });
        case actions_1.default.BOOK_FAILURE:
            return __assign(__assign({}, state), { isFetching: false, error: action.error });
        case actions_1.default.BOOK_LOAD:
            return __assign(__assign({}, state), { data: action.data, url: action.url ? action.url : state.url, isFetching: false });
        case actions_1.default.BOOK_CLEAR:
            return __assign(__assign({}, state), { data: null, url: null, error: null });
        case actions_1.default.CLOSE_ERROR:
            return __assign(__assign({}, state), { error: null });
        case actions_1.default.FULFILL_BOOK_REQUEST:
        case actions_1.default.UPDATE_BOOK_REQUEST:
            return __assign(__assign({}, state), { isFetching: true });
        case actions_1.default.FULFILL_BOOK_SUCCESS:
        case actions_1.default.UPDATE_BOOK_SUCCESS:
            return __assign(__assign({}, state), { isFetching: false });
        case actions_1.default.FULFILL_BOOK_FAILURE:
        case actions_1.default.UPDATE_BOOK_FAILURE:
            return __assign(__assign({}, state), { isFetching: false, error: action.error });
        case actions_1.default.UPDATE_BOOK_LOAD:
            // We might update a book when no book was in the state, for example
            // when borrowing a book from a collection page. In that case,
            // we shouldn't add the book to the state.
            if (state.data === null) {
                return state;
            }
            // If a book was in the state already, we should replace it on update.
            return __assign(__assign({}, state), { data: __assign(__assign({}, state.data), action.data) });
        default:
            return state;
    }
};
exports.default = book;
