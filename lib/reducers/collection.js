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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("./history");
var actions_1 = require("../actions");
exports.initialState = {
    url: null,
    data: null,
    isFetching: false,
    isFetchingPage: false,
    error: null,
    history: []
};
var collection = function (state, action) {
    if (state === void 0) { state = exports.initialState; }
    var _a, _b;
    switch (action.type) {
        case actions_1.default.COLLECTION_REQUEST:
            return __assign(__assign({}, state), { isFetching: true, error: null });
        case actions_1.default.COLLECTION_FAILURE:
            return __assign(__assign({}, state), { isFetching: false, error: action.error });
        case actions_1.default.COLLECTION_LOAD:
            return __assign(__assign({}, state), { data: action.data, url: action.url ? action.url : state.url, isFetching: false, error: null, history: history_1.default(state, action) });
        case actions_1.default.COLLECTION_CLEAR:
            return __assign(__assign({}, state), { data: null, url: null, error: null, history: state.history.slice(0, -1) });
        case actions_1.default.PAGE_REQUEST:
            return __assign(__assign({}, state), { pageUrl: action.url, isFetchingPage: true, error: null });
        case actions_1.default.PAGE_FAILURE:
            return __assign(__assign({}, state), { isFetchingPage: false, error: action.error });
        case actions_1.default.PAGE_LOAD:
            return __assign(__assign({}, state), { data: Object.assign({}, state.data, {
                    // the following optional chaining will evaluate to [] if
                    // state.data.books is null or undefined
                    books: __spreadArrays((_b = (_a = state.data) === null || _a === void 0 ? void 0 : _a.books, (_b !== null && _b !== void 0 ? _b : []))).concat(action.data.books),
                    nextPageUrl: action.data.nextPageUrl
                }), isFetchingPage: false });
        case actions_1.default.SEARCH_DESCRIPTION_LOAD:
            return __assign(__assign({}, state), { data: Object.assign({}, state.data, {
                    search: action.data
                }) });
        case actions_1.default.CLOSE_ERROR:
            return __assign(__assign({}, state), { error: null });
        default:
            return state;
    }
};
exports.default = collection;
