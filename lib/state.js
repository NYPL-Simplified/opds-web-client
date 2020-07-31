"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("./store");
var mergeRootProps_1 = require("./components/mergeRootProps");
/** Builds initial redux state for a collection and book. This isn't used in this
    package, but it's available for other apps if they need to build the state
    for server-side rendering. */
function buildInitialState(collectionUrl, bookUrl) {
    var store = store_1.default(undefined, []);
    var fetchCollectionAndBook = mergeRootProps_1.createFetchCollectionAndBook(store.dispatch);
    return new Promise(function (resolve, reject) {
        fetchCollectionAndBook(collectionUrl, bookUrl)
            .then(function (_a) {
            var collectionData = _a.collectionData, bookData = _a.bookData;
            resolve(store.getState());
        })
            .catch(function (err) { return reject(err); });
    });
}
exports.default = buildInitialState;
