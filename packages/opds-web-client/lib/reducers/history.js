"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function newCollectionIsOldCollection(newCollection, oldCollection) {
    return oldCollection && (newCollection.url === oldCollection.url ||
        newCollection.id === oldCollection.id);
}
function newCollectionIsOldRoot(newCollection, oldCollection) {
    return oldCollection &&
        oldCollection.catalogRootLink &&
        oldCollection.catalogRootLink.url &&
        oldCollection.catalogRootLink.url === newCollection.url;
}
function newCollectionIsNewRoot(newCollection) {
    return newCollection.catalogRootLink &&
        newCollection.catalogRootLink.url === newCollection.url;
}
function newRootIsNotOldRoot(newCollection, oldCollection) {
    return oldCollection &&
        newCollection.catalogRootLink &&
        oldCollection.catalogRootLink &&
        newCollection.catalogRootLink.url !== oldCollection.catalogRootLink.url;
}
function shouldClear(newCollection, oldCollection) {
    return newCollectionIsOldRoot(newCollection, oldCollection) ||
        newCollectionIsNewRoot(newCollection) ||
        newRootIsNotOldRoot(newCollection, oldCollection);
}
exports.shouldClear = shouldClear;
function addLink(history, link) {
    return history.concat([Object.assign({ id: null }, link)]);
}
exports.addLink = addLink;
function addCollection(history, collection) {
    return history.concat([{
            id: collection.id,
            url: collection.url,
            text: collection.title
        }]);
}
exports.addCollection = addCollection;
function shorten(history, newUrl) {
    var newUrlIndex = history.findIndex(function (link) { return link.url === newUrl; });
    if (newUrlIndex !== -1) {
        return history.slice(0, newUrlIndex);
    }
    else {
        return history;
    }
}
exports.shorten = shorten;
function shouldAddRoot(newCollection) {
    return newCollection.catalogRootLink && newCollection.catalogRootLink.text && !newCollectionIsNewRoot(newCollection);
}
exports.shouldAddRoot = shouldAddRoot;
function onlyRoot(newCollection) {
    return addLink([], newCollection.catalogRootLink);
}
exports.onlyRoot = onlyRoot;
exports.default = (function (state, action) {
    var newHistory = state.history.slice(0);
    var newCollection = Object.freeze(action.data);
    var oldCollection = Object.freeze(state.data);
    var cleared = false;
    if (shouldClear(newCollection, oldCollection)) {
        newHistory = [];
        cleared = true;
    }
    var newHistoryCopy = newHistory.slice(0);
    newHistory = shorten(newHistoryCopy, newCollection.url);
    var shortened = newHistory !== newHistoryCopy;
    if (!cleared && !shortened && oldCollection && !newCollectionIsOldCollection(newCollection, oldCollection)) {
        newHistory = addCollection(newHistory, oldCollection);
    }
    if (newHistory.length === 0 && shouldAddRoot(newCollection)) {
        newHistory = onlyRoot(newCollection);
    }
    return newHistory;
});
