"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
;
var initialState = {
    showForm: false,
    callback: null,
    cancel: null,
    credentials: null,
    title: null,
    error: null,
    attemptedProvider: null,
    providers: null
};
exports.default = (function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case actions_1.default.SHOW_AUTH_FORM:
            return Object.assign({}, state, {
                showForm: true,
                callback: action.callback,
                cancel: action.cancel,
                title: action.error ? state.title : action.title,
                error: action.error || null,
                attemptedProvider: action.attemptedProvider || null,
                providers: action.providers
            });
        case actions_1.default.HIDE_AUTH_FORM:
            return Object.assign({}, state, {
                showForm: false,
                error: null
            });
        case actions_1.default.SAVE_AUTH_CREDENTIALS:
            return Object.assign({}, state, {
                credentials: action.credentials
            });
        case actions_1.default.CLEAR_AUTH_CREDENTIALS:
            return Object.assign({}, state, {
                credentials: null
            });
        default:
            return state;
    }
});
