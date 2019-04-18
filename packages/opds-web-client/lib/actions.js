"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Create redux actions to be dispatched by connected components, mostly
    to make requests to the server. */
var ActionCreator = /** @class */ (function () {
    function ActionCreator(fetcher) {
        this.fetcher = fetcher;
    }
    ActionCreator.prototype.fetchBlob = function (type, url) {
        var _this = this;
        return function (dispatch) {
            dispatch(_this.request(type, url));
            return new Promise(function (resolve, reject) {
                _this.fetcher.fetch(url).then(function (response) {
                    if (response.ok) {
                        return response.blob();
                    }
                    else {
                        throw ({
                            status: response.status,
                            response: "Request failed",
                            url: url
                        });
                    }
                }).then(function (blob) {
                    dispatch(_this.success(type));
                    resolve(blob);
                }).catch(function (err) {
                    dispatch(_this.failure(type, err));
                    reject(err);
                });
            });
        };
    };
    ActionCreator.prototype.fetchJSON = function (type, url) {
        var _this = this;
        var err;
        return function (dispatch) {
            return new Promise(function (resolve, reject) {
                dispatch(_this.request(type, url));
                _this.fetcher.fetch(url).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            dispatch(_this.success(type));
                            dispatch(_this.load(type, data));
                            resolve(data);
                        }).catch(function (err) {
                            dispatch(_this.failure(type));
                            reject(err);
                        });
                    }
                    else {
                        response.json().then(function (data) {
                            err = {
                                status: response.status,
                                response: data.detail,
                                url: url
                            };
                            dispatch(_this.failure(type, err));
                            reject(err);
                        }).catch(function (parseError) {
                            err = {
                                status: response.status,
                                response: "Request failed",
                                url: url
                            };
                            dispatch(_this.failure(type, err));
                            reject(err);
                        });
                    }
                }).catch(function (err) {
                    err = {
                        status: null,
                        response: err.message,
                        url: url
                    };
                    dispatch(_this.failure(type, err));
                    reject(err);
                });
            });
        };
    };
    ActionCreator.prototype.fetchOPDS = function (type, url) {
        var _this = this;
        return function (dispatch) {
            dispatch(_this.request(type, url));
            return new Promise(function (resolve, reject) {
                _this.fetcher.fetchOPDSData(url).then(function (data) {
                    dispatch(_this.success(type));
                    dispatch(_this.load(type, data, url));
                    resolve(data);
                }).catch(function (err) {
                    dispatch(_this.failure(type, err));
                    reject(err);
                });
            });
        };
    };
    ActionCreator.prototype.request = function (type, url) {
        return { type: type + "_" + ActionCreator.REQUEST, url: url };
    };
    ActionCreator.prototype.success = function (type) {
        return { type: type + "_" + ActionCreator.SUCCESS };
    };
    ActionCreator.prototype.failure = function (type, error) {
        return { type: type + "_" + ActionCreator.FAILURE, error: error };
    };
    ActionCreator.prototype.load = function (type, data, url) {
        return { type: type + "_" + ActionCreator.LOAD, data: data, url: url };
    };
    ActionCreator.prototype.clear = function (type) {
        return { type: type + "_" + ActionCreator.CLEAR };
    };
    ActionCreator.prototype.fetchCollection = function (url) {
        return this.fetchOPDS(ActionCreator.COLLECTION, url);
    };
    ActionCreator.prototype.fetchPage = function (url) {
        return this.fetchOPDS(ActionCreator.PAGE, url);
    };
    ActionCreator.prototype.fetchBook = function (url) {
        return this.fetchOPDS(ActionCreator.BOOK, url);
    };
    ActionCreator.prototype.fetchSearchDescription = function (url) {
        var _this = this;
        return function (dispatch) {
            return new Promise(function (resolve, reject) {
                _this.fetcher.fetchSearchDescriptionData(url).then(function (data) {
                    dispatch(_this.load(ActionCreator.SEARCH_DESCRIPTION, data, url));
                    resolve(data);
                }).catch(function (err) { return reject(err); });
            });
        };
    };
    ActionCreator.prototype.clearCollection = function () {
        return this.clear(ActionCreator.COLLECTION);
    };
    ActionCreator.prototype.closeError = function () {
        return { type: ActionCreator.CLOSE_ERROR };
    };
    ActionCreator.prototype.loadBook = function (data, url) {
        return this.load(ActionCreator.BOOK, data, url);
    };
    ActionCreator.prototype.clearBook = function () {
        return this.clear(ActionCreator.BOOK);
    };
    ActionCreator.prototype.updateBook = function (url) {
        return this.fetchOPDS(ActionCreator.UPDATE_BOOK, url);
    };
    ActionCreator.prototype.fulfillBook = function (url) {
        return this.fetchBlob(ActionCreator.FULFILL_BOOK, url);
    };
    ActionCreator.prototype.indirectFulfillBook = function (url, type) {
        var _this = this;
        return function (dispatch) {
            return new Promise(function (resolve, reject) {
                dispatch(_this.request(ActionCreator.FULFILL_BOOK, url));
                _this.fetcher.fetchOPDSData(url).then(function (book) {
                    var link = book.fulfillmentLinks.find(function (link) {
                        return link.type === type;
                    });
                    if (link) {
                        dispatch(_this.success(ActionCreator.FULFILL_BOOK));
                        resolve(link.url);
                    }
                    else {
                        throw ({
                            status: 200,
                            response: "Couldn't fulfill book",
                            url: url
                        });
                    }
                }).catch(function (err) {
                    dispatch(_this.failure(ActionCreator.FULFILL_BOOK, err));
                    reject(err);
                });
            });
        };
    };
    ActionCreator.prototype.fetchLoans = function (url) {
        return this.fetchOPDS(ActionCreator.LOANS, url);
    };
    ActionCreator.prototype.showAuthForm = function (callback, cancel, providers, title, error, attemptedProvider) {
        return { type: ActionCreator.SHOW_AUTH_FORM, callback: callback, cancel: cancel, providers: providers, title: title, error: error, attemptedProvider: attemptedProvider };
    };
    ActionCreator.prototype.closeErrorAndHideAuthForm = function () {
        var _this = this;
        return function (dispatch) {
            dispatch(_this.closeError());
            dispatch(_this.hideAuthForm());
        };
    };
    ActionCreator.prototype.hideAuthForm = function () {
        return { type: ActionCreator.HIDE_AUTH_FORM };
    };
    ActionCreator.prototype.saveAuthCredentials = function (credentials) {
        this.fetcher.setAuthCredentials(credentials);
        return { type: ActionCreator.SAVE_AUTH_CREDENTIALS, credentials: credentials };
    };
    ActionCreator.prototype.clearAuthCredentials = function () {
        this.fetcher.clearAuthCredentials();
        return { type: ActionCreator.CLEAR_AUTH_CREDENTIALS };
    };
    ActionCreator.prototype.setPreference = function (key, value) {
        return { type: ActionCreator.SET_PREFERENCE, key: key, value: value };
    };
    ActionCreator.REQUEST = "REQUEST";
    ActionCreator.SUCCESS = "SUCCESS";
    ActionCreator.FAILURE = "FAILURE";
    ActionCreator.LOAD = "LOAD";
    ActionCreator.CLEAR = "CLEAR";
    ActionCreator.COLLECTION = "COLLECTION";
    ActionCreator.PAGE = "PAGE";
    ActionCreator.BOOK = "BOOK";
    ActionCreator.SEARCH_DESCRIPTION = "SEARCH_DESCRIPTION";
    ActionCreator.UPDATE_BOOK = "UPDATE_BOOK";
    ActionCreator.FULFILL_BOOK = "FULFILL_BOOK";
    ActionCreator.LOANS = "LOANS";
    ActionCreator.COLLECTION_REQUEST = "COLLECTION_REQUEST";
    ActionCreator.COLLECTION_SUCCESS = "COLLECTION_SUCCESS";
    ActionCreator.COLLECTION_FAILURE = "COLLECTION_FAILURE";
    ActionCreator.COLLECTION_LOAD = "COLLECTION_LOAD";
    ActionCreator.COLLECTION_CLEAR = "COLLECTION_CLEAR";
    ActionCreator.PAGE_REQUEST = "PAGE_REQUEST";
    ActionCreator.PAGE_SUCCESS = "PAGE_SUCCESS";
    ActionCreator.PAGE_FAILURE = "PAGE_FAILURE";
    ActionCreator.PAGE_LOAD = "PAGE_LOAD";
    ActionCreator.BOOK_REQUEST = "BOOK_REQUEST";
    ActionCreator.BOOK_SUCCESS = "BOOK_SUCCESS";
    ActionCreator.BOOK_FAILURE = "BOOK_FAILURE";
    ActionCreator.BOOK_LOAD = "BOOK_LOAD";
    ActionCreator.BOOK_CLEAR = "BOOK_CLEAR";
    ActionCreator.SEARCH_DESCRIPTION_LOAD = "SEARCH_DESCRIPTION_LOAD";
    ActionCreator.CLOSE_ERROR = "CLOSE_ERROR";
    ActionCreator.UPDATE_BOOK_REQUEST = "UPDATE_BOOK_REQUEST";
    ActionCreator.UPDATE_BOOK_SUCCESS = "UPDATE_BOOK_SUCCESS";
    ActionCreator.UPDATE_BOOK_FAILURE = "UPDATE_BOOK_FAILURE";
    ActionCreator.UPDATE_BOOK_LOAD = "UPDATE_BOOK_LOAD";
    ActionCreator.FULFILL_BOOK_REQUEST = "FULFILL_BOOK_REQUEST";
    ActionCreator.FULFILL_BOOK_SUCCESS = "FULFILL_BOOK_SUCCESS";
    ActionCreator.FULFILL_BOOK_FAILURE = "FULFILL_BOOK_FAILURE";
    ActionCreator.LOANS_REQUEST = "LOANS_REQUEST";
    ActionCreator.LOANS_SUCCESS = "LOANS_SUCCESS";
    ActionCreator.LOANS_FAILURE = "LOANS_FAILURE";
    ActionCreator.LOANS_LOAD = "LOANS_LOAD";
    ActionCreator.SHOW_AUTH_FORM = "SHOW_AUTH_FORM";
    ActionCreator.HIDE_AUTH_FORM = "HIDE_AUTH_FORM";
    ActionCreator.SAVE_AUTH_CREDENTIALS = "SAVE_AUTH_CREDENTIALS";
    ActionCreator.CLEAR_AUTH_CREDENTIALS = "CLEAR_AUTH_CREDENTIALS";
    ActionCreator.SET_PREFERENCE = "SET_PREFERENCE";
    return ActionCreator;
}());
exports.default = ActionCreator;
