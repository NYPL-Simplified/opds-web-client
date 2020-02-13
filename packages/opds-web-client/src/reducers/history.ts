import { RequiredKeys } from "./../interfaces";
import { CollectionState } from "./collection";
import { LoadAction } from "../actions";
import { CollectionData, LinkData } from "../interfaces";

function newCollectionIsOldCollection(
  newCollection: CollectionData,
  oldCollection: CollectionData
): boolean {
  return (
    oldCollection &&
    (newCollection.url === oldCollection.url ||
      newCollection.id === oldCollection.id)
  );
}

function newCollectionIsOldRoot(
  newCollection: CollectionData,
  oldCollection: CollectionData | undefined | null
): boolean {
  return oldCollection?.catalogRootLink?.url === newCollection.url;
}

function newCollectionIsNewRoot(newCollection: CollectionData): boolean {
  return newCollection?.catalogRootLink?.url === newCollection.url;
}

function newRootIsNotOldRoot(
  newCollection: CollectionData,
  oldCollection: CollectionData | undefined | null
): boolean {
  return !!(
    oldCollection &&
    newCollection.catalogRootLink &&
    oldCollection.catalogRootLink &&
    newCollection.catalogRootLink.url !== oldCollection.catalogRootLink.url
  );
}

export function shouldClear(
  newCollection: CollectionData,
  oldCollection: CollectionData | undefined | null
): boolean {
  return (
    newCollectionIsOldRoot(newCollection, oldCollection) ||
    newCollectionIsNewRoot(newCollection) ||
    newRootIsNotOldRoot(newCollection, oldCollection)
  );
}

export function addLink(history: LinkData[], link: LinkData): LinkData[] {
  return history.concat([{ id: null, ...link }]);
}

export function addCollection(
  history: LinkData[],
  collection: CollectionData
): LinkData[] {
  return history.concat([
    {
      id: collection.id,
      url: collection.url,
      text: collection.title
    }
  ]);
}

export function shorten(history: LinkData[], newUrl: string) {
  let newUrlIndex = history.findIndex(link => link.url === newUrl);

  if (newUrlIndex !== -1) {
    return history.slice(0, newUrlIndex);
  } else {
    return history;
  }
}
type CollectionWithRootLink = RequiredKeys<CollectionData, "catalogRootLink">;

export function shouldAddRoot(
  newCollection: CollectionData
): newCollection is CollectionWithRootLink {
  return !!(
    newCollection.catalogRootLink?.text &&
    !newCollectionIsNewRoot(newCollection)
  );
}

export function onlyRoot(newCollection: CollectionWithRootLink) {
  return addLink([], newCollection.catalogRootLink);
}

export default (state: CollectionState, action: LoadAction<CollectionData>) => {
  let newHistory = state.history.slice(0);
  let newCollection = Object.freeze(action.data);
  let oldCollection = Object.freeze(state.data);

  let cleared = false;
  if (shouldClear(newCollection, oldCollection)) {
    newHistory = [];
    cleared = true;
  }

  let newHistoryCopy = newHistory.slice(0);
  newHistory = shorten(newHistoryCopy, newCollection.url);
  let shortened = newHistory !== newHistoryCopy;

  if (
    !cleared &&
    !shortened &&
    oldCollection &&
    !newCollectionIsOldCollection(newCollection, oldCollection)
  ) {
    newHistory = addCollection(newHistory, oldCollection);
  }

  if (newHistory.length === 0 && shouldAddRoot(newCollection)) {
    newHistory = onlyRoot(newCollection);
  }

  return newHistory;
};
