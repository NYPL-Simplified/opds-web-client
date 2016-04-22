import { CollectionState } from "./collection";
import { LoadCollectionAction } from "../actions";

export default (state: CollectionState, action: LoadCollectionAction) => {
  let newHistory;
  let oldHistory = state.history;

  if ((state.data && state.data.catalogRootUrl && state.data.catalogRootUrl === action.url) ||
      (action.data.catalogRootUrl && action.data.catalogRootUrl === action.url)) {
    newHistory = [];
  } else {
    let newUrlIndex = oldHistory.findIndex((link) => {
      return link.url === action.url;
    });
    if (newUrlIndex !== -1) {
      newHistory = oldHistory.slice(0, newUrlIndex);
    } else {
      newHistory = oldHistory.slice(0);
      if (state.data) {
        let isSameFeed = (state.data.id === action.data.id);
        let isSameTitle = (state.data.title === action.data.title);

        if (!isSameFeed && !isSameTitle) {
          newHistory.push({
            url: state.data.url,
            text: state.data.title,
            id: state.data.id
          });
        }
      }
    }

    if (action.data.catalogRootUrl) {
      let catalogRootUrlInHistory = newHistory.find((link) => {
        return link.url === action.data.catalogRootUrl;
      });

      if (!catalogRootUrlInHistory) {
        newHistory = [{
          text: "Catalog",
          url: action.data.catalogRootUrl,
          id: null
        }];
      }
    }
  }

  return newHistory;
}