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
function newCollectionIsOldCollection(newCollection, oldCollection) {
    return (oldCollection &&
        (newCollection.url === oldCollection.url ||
            newCollection.id === oldCollection.id));
}
function newCollectionIsOldRoot(newCollection, oldCollection) {
    var _a, _b;
    return ((_b = (_a = oldCollection) === null || _a === void 0 ? void 0 : _a.catalogRootLink) === null || _b === void 0 ? void 0 : _b.url) === newCollection.url;
}
function newCollectionIsNewRoot(newCollection) {
    var _a, _b;
    return ((_b = (_a = newCollection) === null || _a === void 0 ? void 0 : _a.catalogRootLink) === null || _b === void 0 ? void 0 : _b.url) === newCollection.url;
}
function newRootIsNotOldRoot(newCollection, oldCollection) {
    return !!(oldCollection &&
        newCollection.catalogRootLink &&
        oldCollection.catalogRootLink &&
        newCollection.catalogRootLink.url !== oldCollection.catalogRootLink.url);
}
function shouldClear(newCollection, oldCollection) {
    return (newCollectionIsOldRoot(newCollection, oldCollection) ||
        newCollectionIsNewRoot(newCollection) ||
        newRootIsNotOldRoot(newCollection, oldCollection));
}
exports.shouldClear = shouldClear;
function addLink(history, link) {
    return history.concat([__assign({ id: null }, link)]);
}
exports.addLink = addLink;
function addCollection(history, collection) {
    return history.concat([
        {
            id: collection.id,
            url: collection.url,
            text: collection.title
        }
    ]);
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
    var _a;
    return !!(((_a = newCollection.catalogRootLink) === null || _a === void 0 ? void 0 : _a.text) &&
        !newCollectionIsNewRoot(newCollection));
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
    if (!cleared &&
        !shortened &&
        oldCollection &&
        !newCollectionIsOldCollection(newCollection, oldCollection)) {
        newHistory = addCollection(newHistory, oldCollection);
    }
    if (newHistory.length === 0 && shouldAddRoot(newCollection)) {
        newHistory = onlyRoot(newCollection);
    }
    return newHistory;
});
