import { CollectionState } from "./collection";
import { LoadCollectionAction } from "../actions";
import { LinkData} from "../interfaces";

export default (state: CollectionState, action: LoadCollectionAction) => {
  let oldHistory = state.history.slice(0);
  let oldCollection = state.data;
  let oldUrl = oldCollection && (oldCollection.selfUrl || oldCollection.url);

  let newHistory = oldHistory;
  let newCollection = action.data;
  let newUrl = action.url;

  function newCollectionIsOldCollection() {
    return oldCollection && (
             newCollection.url === oldCollection.url ||
             newCollection.id === oldCollection.id
           );
  }

  function newParentIsNotOldUrl() {
    return newCollection.parentLink &&
           newCollection.parentLink.url &&
           newCollection.parentLink.url !== oldUrl;
  }

  function newCollectionIsOldRoot() {
    return oldCollection &&
           oldCollection.catalogRootLink &&
           oldCollection.catalogRootLink.url &&
           oldCollection.catalogRootLink.url === newUrl;
  }

  function newCollectionIsNewRoot() {
    return newCollection.catalogRootLink &&
           newCollection.catalogRootLink.url === newUrl;
  }

  function newRootIsNotOldRoot() {
    return newCollection.catalogRootLink &&
           oldCollection.catalogRootLink &&
           newCollection.catalogRootLink.url !== oldCollection.catalogRootLink.url;
  }

  function shouldClear() {
    return newParentIsNotOldUrl() ||
           newCollectionIsOldRoot() ||
           newCollectionIsNewRoot() ||
           newRootIsNotOldRoot();
  }

  function shorten() {
    let newUrlIndex = oldHistory.findIndex(link => link.url === newUrl);

    if (newUrlIndex !== -1) {
      newHistory = newHistory.slice(0, newUrlIndex);
      return true;
    } else {
      return false;
    }
  }

  function clear() {
    newHistory = [];
  }

  function add(link: LinkData) {
    newHistory.push(Object.assign({ id: null }, link));
  }

  function addRootAndParent() {
    // if new url is new catalog root, history should remain clear
    if (newCollection.catalogRootLink &&
        newCollection.catalogRootLink.text &&
        newCollection.catalogRootLink.url !== newUrl) {
      add(newCollection.catalogRootLink);

      // only add parent if:
      // there's a root
      // there's a parent
      // and parent isn't the root
      // and parent isn't the new url
      if (newCollection.parentLink &&
          newCollection.parentLink.url !== newCollection.catalogRootLink.url &&
          newCollection.parentLink.url !== newUrl) {
        add(newCollection.parentLink);
      }
    }
  }

  function addOldCollection() {
    if (oldCollection) {
      newHistory.push({
        id: oldCollection.id,
        url: oldCollection.url,
        text: oldCollection.title
      });
    }
  }

  // MAIN LOGIC BELOW

  if (shouldClear()) {
    clear();
    addRootAndParent();
  } else if (!shorten() && !newCollectionIsOldCollection()) {
    addOldCollection();
  }

  return newHistory;
}