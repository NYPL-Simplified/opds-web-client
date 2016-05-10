import { CollectionState } from "./collection";
import { LoadCollectionAction } from "../actions";
import { CollectionData, LinkData } from "../interfaces";

function newCollectionIsOldCollection(newCollection: CollectionData, oldCollection: CollectionData): boolean {
  return oldCollection && (
           newCollection.url === oldCollection.url ||
           newCollection.id === oldCollection.id
         );
}

function newCollectionIsOldRoot(newCollection: CollectionData, oldCollection: CollectionData): boolean {
  return oldCollection &&
         oldCollection.catalogRootLink &&
         oldCollection.catalogRootLink.url &&
         oldCollection.catalogRootLink.url === newCollection.url;
}

function newCollectionIsNewRoot(newCollection: CollectionData): boolean {
  return newCollection.catalogRootLink &&
         newCollection.catalogRootLink.url === newCollection.url;
}

function newRootIsNotOldRoot(newCollection: CollectionData, oldCollection: CollectionData): boolean {
  return oldCollection &&
         newCollection.catalogRootLink &&
         oldCollection.catalogRootLink &&
         newCollection.catalogRootLink.url !== oldCollection.catalogRootLink.url;
}

export function shouldClear(newCollection: CollectionData, oldCollection: CollectionData): boolean {
  return newCollectionIsOldRoot(newCollection, oldCollection) ||
         newCollectionIsNewRoot(newCollection) ||
         newRootIsNotOldRoot(newCollection, oldCollection);
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

export function shouldAddRoot(newCollection: CollectionData) {
  return newCollection.catalogRootLink && newCollection.catalogRootLink.text && !newCollectionIsNewRoot(newCollection);
}

export function onlyRoot(newCollection:  CollectionData) {
  return addLink([], newCollection.catalogRootLink);
}

export default (state: CollectionState, action: LoadCollectionAction) => {
  let newHistory = state.history.slice(0);
  let newCollection = Object.freeze(action.data);
  let oldCollection = Object.freeze(state.data);

  let cleared = false;
  if (shouldClear(newCollection, oldCollection)) {
    newHistory = [];
    cleared = true;
  }

  if (newHistory.length === 0 && shouldAddRoot(newCollection)) {
    newHistory = onlyRoot(newCollection);
  }

  if (!cleared && oldCollection && !newCollectionIsOldCollection(newCollection, oldCollection)) {
    newHistory = addCollection(newHistory, oldCollection);
  }

  return newHistory;
};