"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
var DataFetcher_1 = require("../DataFetcher");
var OPDSDataAdapter_1 = require("../OPDSDataAdapter");
function findBookInCollection(collection, book) {
    if (collection) {
        var allBooks = collection.lanes.reduce(function (books, lane) {
            return books.concat(lane.books);
        }, collection.books);
        return allBooks.find(function (b) { return b.url === book || b.id === book; });
    }
    else {
        return null;
    }
}
exports.findBookInCollection = findBookInCollection;
function mapStateToProps(state, ownProps) {
    return {
        collectionData: state.collection.data || ownProps.collectionData,
        isFetchingCollection: state.collection.isFetching,
        isFetchingPage: state.collection.isFetchingPage,
        isFetchingBook: state.book.isFetching,
        error: state.collection.error || state.book.error,
        bookData: state.book.data || ownProps.bookData,
        history: state.collection.history,
        loadedCollectionUrl: state.collection.url,
        loadedBookUrl: state.book.url,
        collectionUrl: ownProps.collectionUrl,
        bookUrl: ownProps.bookUrl,
        loansUrl: state.loans.url,
        loans: state.loans.books,
        auth: state.auth,
        isSignedIn: !!state.auth.credentials,
        preferences: state.preferences
    };
}
exports.mapStateToProps = mapStateToProps;
function mapDispatchToProps(dispatch) {
    return {
        createDispatchProps: function (fetcher) {
            var actions = new actions_1.default(fetcher);
            return {
                fetchCollection: function (url) {
                    return dispatch(actions.fetchCollection(url));
                },
                fetchPage: function (url) { return dispatch(actions.fetchPage(url)); },
                fetchBook: function (url) { return dispatch(actions.fetchBook(url)); },
                loadBook: function (book, url) {
                    return dispatch(actions.loadBook(book, url));
                },
                clearCollection: function () { return dispatch(actions.clearCollection()); },
                clearBook: function () { return dispatch(actions.clearBook()); },
                fetchSearchDescription: function (url) {
                    return dispatch(actions.fetchSearchDescription(url));
                },
                closeError: function () { return dispatch(actions.closeError()); },
                updateBook: function (url) { return dispatch(actions.updateBook(url)); },
                fulfillBook: function (url) { return dispatch(actions.fulfillBook(url)); },
                indirectFulfillBook: function (url, type) {
                    return dispatch(actions.indirectFulfillBook(url, type));
                },
                fetchLoans: function (url) { return dispatch(actions.fetchLoans(url)); },
                saveAuthCredentials: function (credentials) {
                    return dispatch(actions.saveAuthCredentials(credentials));
                },
                clearAuthCredentials: function () { return dispatch(actions.clearAuthCredentials()); },
                showAuthForm: function (callback, cancel, providers, title) { return dispatch(actions.showAuthForm(callback, cancel, providers, title)); },
                closeErrorAndHideAuthForm: function () {
                    return dispatch(actions.closeErrorAndHideAuthForm());
                },
                setPreference: function (key, value) {
                    return dispatch(actions.setPreference(key, value));
                }
            };
        }
    };
}
exports.mapDispatchToProps = mapDispatchToProps;
// only used by a server when it needs to fetch collection and/or book data
// for a particular route into a store before it renders to HTML
function createFetchCollectionAndBook(dispatch) {
    var fetcher = new DataFetcher_1.default({ adapter: OPDSDataAdapter_1.adapter });
    var actions = mapDispatchToProps(dispatch).createDispatchProps(fetcher);
    var fetchCollection = actions.fetchCollection, fetchBook = actions.fetchBook;
    return function (collectionUrl, bookUrl) {
        return fetchCollectionAndBook({
            fetchCollection: fetchCollection,
            fetchBook: fetchBook,
            collectionUrl: collectionUrl,
            bookUrl: bookUrl
        });
    };
}
exports.createFetchCollectionAndBook = createFetchCollectionAndBook;
function fetchCollectionAndBook(_a) {
    var fetchCollection = _a.fetchCollection, fetchBook = _a.fetchBook, collectionUrl = _a.collectionUrl, bookUrl = _a.bookUrl;
    return new Promise(function (resolve, reject) {
        if (collectionUrl) {
            fetchCollection(collectionUrl)
                .then(function (collectionData) {
                if (bookUrl) {
                    fetchBook(bookUrl)
                        .then(function (bookData) {
                        resolve({ collectionData: collectionData, bookData: bookData });
                    })
                        .catch(function (err) { return reject(err); });
                }
                else {
                    resolve({ collectionData: collectionData, bookData: null });
                }
            })
                .catch(function (err) { return reject(err); });
        }
        else if (bookUrl) {
            fetchBook(bookUrl)
                .then(function (bookData) {
                resolve({ collectionData: null, bookData: bookData });
            })
                .catch(function (err) { return reject(err); });
        }
        else {
            resolve({ collectionData: null, bookData: null });
        }
    });
}
exports.fetchCollectionAndBook = fetchCollectionAndBook;
function mergeRootProps(stateProps, createDispatchProps, componentProps) {
    var fetcher = new DataFetcher_1.default({
        proxyUrl: componentProps.proxyUrl,
        adapter: OPDSDataAdapter_1.adapter
    });
    var dispatchProps = createDispatchProps.createDispatchProps(fetcher);
    var authCredentials = fetcher.getAuthCredentials();
    var setCollection = function (url) {
        return new Promise(function (resolve, reject) {
            if (url === stateProps.loadedCollectionUrl) {
                // if url is same, do nothing unless there's currently error
                if (stateProps.error) {
                    dispatchProps.fetchCollection(url).then(function (data) { return resolve(data); });
                }
                else {
                    resolve(stateProps.collectionData);
                }
            }
            else {
                // if url is changed, either fetch or clear collection
                if (url) {
                    dispatchProps.fetchCollection(url).then(function (data) { return resolve(data); });
                }
                else {
                    dispatchProps.clearCollection();
                    resolve(null);
                }
            }
        });
    };
    var setBook = function (book, collectionData) {
        if (collectionData === void 0) { collectionData = null; }
        return new Promise(function (resolve, reject) {
            var _a, _b;
            var url = null;
            var bookData = null;
            if (typeof book === "string") {
                url = book;
                bookData = (_a = findBookInCollection(collectionData, url), (_a !== null && _a !== void 0 ? _a : null));
            }
            else if (book && typeof book === "object") {
                url = (_b = book.url, (_b !== null && _b !== void 0 ? _b : null));
                bookData = book;
            }
            if (bookData) {
                dispatchProps.loadBook(bookData, url);
                resolve(bookData);
            }
            else if (url) {
                dispatchProps.fetchBook(url).then(function (data) { return resolve(data); });
            }
            else {
                dispatchProps.clearBook();
                resolve(null);
            }
        });
    };
    var setCollectionAndBook = function (collectionUrl, bookUrl) {
        return new Promise(function (resolve, reject) {
            setCollection(collectionUrl)
                .then(function (collectionData) {
                setBook(bookUrl, collectionData)
                    .then(function (bookData) {
                    resolve({ collectionData: collectionData, bookData: bookData });
                })
                    .catch(function (err) { return reject(err); });
            })
                .catch(function (err) { return reject(err); });
        });
    };
    var fetchCollection = dispatchProps.fetchCollection, fetchBook = dispatchProps.fetchBook;
    var updateBook = function (url) {
        return dispatchProps.updateBook(url).then(function (data) {
            if (stateProps.loansUrl) {
                dispatchProps.fetchLoans(stateProps.loansUrl);
            }
            return data;
        });
    };
    return Object.assign({}, componentProps, stateProps, dispatchProps, {
        authCredentials: authCredentials,
        setCollection: setCollection,
        setBook: setBook,
        setCollectionAndBook: setCollectionAndBook,
        refreshCollectionAndBook: function () {
            return fetchCollectionAndBook({
                fetchCollection: fetchCollection,
                fetchBook: fetchBook,
                collectionUrl: stateProps.loadedCollectionUrl,
                bookUrl: stateProps.loadedBookUrl
            });
        },
        retryCollectionAndBook: function () {
            var collectionUrl = stateProps.collectionUrl, bookUrl = stateProps.bookUrl;
            return fetchCollectionAndBook({
                fetchCollection: fetchCollection,
                fetchBook: fetchBook,
                collectionUrl: collectionUrl,
                bookUrl: bookUrl
            });
        },
        clearCollection: function () {
            setCollection(null);
        },
        clearBook: function () {
            setBook(null);
        },
        updateBook: updateBook
    });
}
exports.mergeRootProps = mergeRootProps;
