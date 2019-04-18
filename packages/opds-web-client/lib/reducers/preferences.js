"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
var initialState = {};
exports.default = (function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case actions_1.default.SET_PREFERENCE:
            var change = {};
            change[action.key] = action.value;
            return Object.assign({}, state, change);
        default:
            return state;
    }
});
