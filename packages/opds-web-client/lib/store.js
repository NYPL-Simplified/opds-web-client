"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var index_1 = require("./reducers/index");
var thunk = require("redux-thunk").default;
var authMiddleware_1 = require("./authMiddleware");
var persistState = null;
try {
    var testKey = String(Math.random());
    window.localStorage.setItem(testKey, "test");
    window.localStorage.removeItem(testKey);
    persistState = require("redux-localstorage");
}
catch (e) {
    // localStorage isn't available in this environment, so preferences won't be saved.
}
/** Builds the Redux store. If any auth plugins are passed in, it will add auth middleware.
    If localStorage is available, it will persist the preferences state only. */
function buildStore(initialState, authPlugins, pathFor) {
    var middlewares = authPlugins && authPlugins.length ? [authMiddleware_1.default(authPlugins, pathFor), thunk] : [thunk];
    var composeArgs = [redux_1.applyMiddleware.apply(void 0, middlewares)];
    if (persistState) {
        composeArgs.push(persistState("preferences"));
    }
    return redux_1.createStore(index_1.default, initialState, redux_1.compose.apply(this, composeArgs));
}
exports.default = buildStore;
