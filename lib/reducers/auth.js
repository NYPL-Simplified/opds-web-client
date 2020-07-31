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
            return __assign(__assign({}, state), { showForm: true, callback: action.callback, cancel: action.cancel, title: action.error ? state.title : action.title, error: action.error || null, attemptedProvider: action.attemptedProvider || null, providers: action.providers });
        case actions_1.default.HIDE_AUTH_FORM:
            return __assign(__assign({}, state), { showForm: false, error: null });
        case actions_1.default.SAVE_AUTH_CREDENTIALS:
            return __assign(__assign({}, state), { credentials: action.credentials });
        case actions_1.default.CLEAR_AUTH_CREDENTIALS:
            return __assign(__assign({}, state), { credentials: null });
        default:
            return state;
    }
});
