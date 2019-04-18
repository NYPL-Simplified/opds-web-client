"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("./history");
var actions_1 = require("../actions");
var initialState = {
    url: null,
    data: null,
    isFetching: false,
    isFetchingPage: false,
    error: null,
    history: []
};
var collection = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case actions_1.default.COLLECTION_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                error: null
            });
        case actions_1.default.COLLECTION_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        case actions_1.default.COLLECTION_LOAD:
            return Object.assign({}, state, {
                data: action.data,
                url: action.url ? action.url : state.url,
                isFetching: false,
                error: null,
                history: history_1.default(state, action)
            });
        case actions_1.default.COLLECTION_CLEAR:
            return Object.assign({}, state, {
                data: null,
                url: null,
                error: null,
                history: state.history.slice(0, -1)
            });
        case actions_1.default.PAGE_REQUEST:
            return Object.assign({}, state, {
                pageUrl: action.url,
                isFetchingPage: true,
                error: null
            });
        case actions_1.default.PAGE_FAILURE:
            return Object.assign({}, state, {
                isFetchingPage: false,
                error: action.error
            });
        case actions_1.default.PAGE_LOAD:
            return Object.assign({}, state, {
                data: Object.assign({}, state.data, {
                    books: Object.assign([], state.data.books).concat(action.data.books),
                    nextPageUrl: action.data.nextPageUrl
                }),
                isFetchingPage: false
            });
        case actions_1.default.SEARCH_DESCRIPTION_LOAD:
            return Object.assign({}, state, {
                data: Object.assign({}, state.data, {
                    search: action.data
                })
            });
        case actions_1.default.CLOSE_ERROR:
            return Object.assign({}, state, {
                error: null
            });
        default:
            return state;
    }
};
exports.default = collection;
