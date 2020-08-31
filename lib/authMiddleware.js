"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataFetcher_1 = require("./DataFetcher");
var actions_1 = require("./actions");
/** Redux middleware for handling requests that require authentication.
    Intercepts 401 errors and shows an authentication form, then retries the
    original request after the user authenticates.
    See Redux Middleware docs:
    http://redux.js.org/docs/advanced/Middleware.html */
exports.default = (function (authPlugins, pathFor) {
    return function (store) { return function (next) { return function (action) {
        var fetcher = new DataFetcher_1.default();
        var actions = new actions_1.default(fetcher);
        if (typeof action === "function") {
            return new Promise(function (resolve, reject) {
                next(actions.hideAuthForm());
                var result = next(action);
                if (result && result.then) {
                    result.then(resolve).catch(function (err) {
                        var _a;
                        if (err.status === 401) {
                            var error = void 0;
                            var data_1;
                            // response might not be JSON
                            try {
                                data_1 = JSON.parse(err.response);
                            }
                            catch (e) {
                                reject(err);
                                return;
                            }
                            if (err.headers && err.headers["www-authenticate"]) {
                                // browser's default basic auth form was shown,
                                // so don't show ours
                                reject(err);
                            }
                            else {
                                // clear any invalid credentials, after getting the provider that was used
                                var existingAuth = fetcher.getAuthCredentials();
                                var attemptedProvider = null;
                                if (existingAuth) {
                                    attemptedProvider = existingAuth.provider;
                                    // 401s resulting from wrong username/password return
                                    // problem detail documents, not auth documents
                                    error = data_1.title;
                                    store.dispatch(actions.clearAuthCredentials());
                                }
                                // find providers with supported auth method
                                var authProviders_1 = [];
                                authPlugins.forEach(function (plugin) {
                                    for (var _i = 0, _a = data_1.authentication || []; _i < _a.length; _i++) {
                                        var method = _a[_i];
                                        if (method.type === plugin.type) {
                                            // If the authentication provider doesn't have a unique
                                            // identifier, use the method type. This won't work if the
                                            // auth document has two providers with the same method type.
                                            var id = method.id || method.type;
                                            authProviders_1.push({ id: id, plugin: plugin, method: method });
                                        }
                                    }
                                });
                                if (existingAuth || authProviders_1.length) {
                                    var callback = function () {
                                        // use dispatch() instead of next() to start from the top
                                        store
                                            .dispatch(action)
                                            .then(function () {
                                            resolve();
                                        })
                                            .catch(function (err) {
                                            reject(err);
                                        });
                                    };
                                    // if the collection and book urls in the state don't match
                                    // the current url, we're on a page that requires authentication
                                    // and cancel should go back to the previous page. otherwise,
                                    // it should just close the form.
                                    var oldCollectionUrl = store.getState().collection.url;
                                    var oldBookUrl = store.getState().book.url;
                                    var currentUrl = window.location.pathname;
                                    var cancel = void 0;
                                    if (((_a = pathFor) === null || _a === void 0 ? void 0 : _a(oldCollectionUrl, oldBookUrl)) === currentUrl) {
                                        cancel = function () {
                                            next(actions.hideAuthForm());
                                        };
                                    }
                                    else {
                                        cancel = function () {
                                            history.back();
                                        };
                                    }
                                    var title = void 0;
                                    // if previous auth failed, we have to get providers
                                    // from store, instead of response data
                                    if (existingAuth) {
                                        var state = store.getState();
                                        title = state.auth.title;
                                        authProviders_1 = state.auth.providers;
                                    }
                                    else {
                                        title = data_1.title;
                                    }
                                    // if previous auth failed and we didn't have any providers
                                    // in the store, we need to start the request again from the top
                                    // (with cleared credentials) to get the opds authentication document.
                                    if (existingAuth && authProviders_1 === null) {
                                        store.dispatch(action);
                                        resolve();
                                    }
                                    else {
                                        next(actions.closeError());
                                        next(actions.showAuthForm(callback, cancel, authProviders_1, title, error, attemptedProvider));
                                    }
                                }
                                else {
                                    // no provider found with basic auth method
                                    // currently this custom response will not make it to the user,
                                    // becuase the fetch error has already been dispatched by
                                    // fetchCollectionFailure, fetchBookFailure, etc
                                    next(actions.hideAuthForm());
                                    reject({
                                        status: 401,
                                        response: "Authentication is required but no compatible authentication method was found.",
                                        url: err.url
                                    });
                                }
                            }
                        }
                        else {
                            next(actions.hideAuthForm());
                            reject(err);
                        }
                    });
                }
            }).catch(function (err) {
                // this is where we could potentially dispatch a custom auth error action
                // displaying a more informative error
            });
        }
        next(actions.hideAuthForm());
        next(action);
    }; }; };
});
