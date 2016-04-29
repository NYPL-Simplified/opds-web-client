import { CollectionState } from "./collection";
import { LoadCollectionAction } from "../actions";
import { CollectionData, LinkData } from "../interfaces";

function newCollectionIsOldCollection(newCollection: CollectionData, oldCollection: CollectionData): boolean {
  return oldCollection && (
           newCollection.url === oldCollection.url ||
           newCollection.id === oldCollection.id
         );
}

function newParentIsNotOldUrl(newCollection: CollectionData, oldUrl: string): boolean {
  return newCollection.parentLink &&
         newCollection.parentLink.url &&
         newCollection.parentLink.url !== oldUrl;
}

function newCollectionIsOldRoot(newUrl: string, oldCollection: CollectionData): boolean {
  return oldCollection &&
         oldCollection.catalogRootLink &&
         oldCollection.catalogRootLink.url &&
         oldCollection.catalogRootLink.url === newUrl;
}

function newCollectionIsNewRoot(newCollection: CollectionData, newUrl: string): boolean {
  return newCollection.catalogRootLink &&
         newCollection.catalogRootLink.url === newUrl;
}

function newRootIsNotOldRoot(newCollection: CollectionData, oldCollection: CollectionData): boolean {
  return newCollection.catalogRootLink &&
         oldCollection.catalogRootLink &&
         newCollection.catalogRootLink.url !== oldCollection.catalogRootLink.url;
}

export function shouldClear(newCollection: CollectionData, newUrl: string, oldCollection: CollectionData): boolean {
  let oldUrl = oldCollection && (oldCollection.selfUrl || oldCollection.url);

  return newParentIsNotOldUrl(newCollection, oldUrl) ||
         newCollectionIsOldRoot(newUrl, oldCollection) ||
         newCollectionIsNewRoot(newCollection, newUrl) ||
         newRootIsNotOldRoot(newCollection, oldCollection);
}

export function shorten(history: LinkData[], newUrl: string) {
  let newUrlIndex = history.findIndex(link => link.url === newUrl);

  if (newUrlIndex !== -1) {
    return history.slice(0, newUrlIndex);
  } else {
    return history;
  }
}

export function addLink(history: LinkData[], link: LinkData): LinkData[] {
  return history.concat([Object.assign({ id: null }, link)]);
}

export function addCollection(history: LinkData[], collection: CollectionData): LinkData[] {
  return history.concat([{
    id: collection.id,
    url: collection.url,
    text: collection.title
  }]);
}

export function clearWithRootAndParent(history: LinkData[], newCollection: CollectionData, newUrl: string): LinkData[] {
  history = [];

  // if new url is new catalog root, history should remain clear
  if (newCollection.catalogRootLink &&
      newCollection.catalogRootLink.text &&
      newCollection.catalogRootLink.url !== newUrl) {
    history = addLink(history, newCollection.catalogRootLink);

    // only add parent if:
    // there's a root
    // there's a parent
    // and parent isn't the root
    // and parent isn't the new url
    if (newCollection.parentLink &&
        newCollection.parentLink.url !== newCollection.catalogRootLink.url &&
        newCollection.parentLink.url !== newUrl) {
      history = addLink(history, newCollection.parentLink);
    }
  }

  return history;
}

export default (state: CollectionState, action: LoadCollectionAction) => {
  let oldHistory = Object.freeze(state.history);
  let oldCollection = Object.freeze(state.data);
  let oldUrl = Object.freeze(oldCollection && (oldCollection.selfUrl || oldCollection.url));

  let newHistory = oldHistory.slice(0);
  let newCollection = Object.freeze(action.data);
  let newUrl = Object.freeze(action.url);

  if (shouldClear(newCollection, newUrl, oldCollection)) {
    newHistory = clearWithRootAndParent(newHistory, newCollection, newUrl);
  } else {
    let newHistoryCopy = newHistory.slice(0);
    newHistory = shorten(newHistoryCopy, newUrl);

    if (oldCollection && newHistory === newHistoryCopy && !newCollectionIsOldCollection(newCollection, oldCollection)) {
      newHistory = addCollection(newHistory, oldCollection);
    }
  }

  return newHistory;
}