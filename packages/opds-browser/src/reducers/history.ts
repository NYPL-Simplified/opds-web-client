import { CollectionState } from "./collection";
import { LoadCollectionAction } from "../actions";

export default (state: CollectionState, action: LoadCollectionAction) => {
  let newHistory;
  let oldHistory = state.history;

  let { catalogRootLink, parentLink } = action.data;
  let previousUrl = state.data && (state.data.selfUrl || state.data.url);

  if (parentLink && parentLink.url &&
      parentLink.url !== previousUrl) {
      // parent url is different than the previous url
      // so we only show the root and parent
      newHistory = [];

      if (catalogRootLink && catalogRootLink.url !== action.url) {
        newHistory.push({
          text: catalogRootLink.text || "Catalog",
          url: catalogRootLink.url,
          id: null
        });
      }

      if (parentLink.url !== catalogRootLink.url &&
          parentLink.url !== action.url) {
        newHistory.push({
          text: parentLink.text,
          url: parentLink.url,
          id: null
        });
      }
  } else {
    if ((state.data && state.data.catalogRootLink && state.data.catalogRootLink.url && state.data.catalogRootLink.url === action.url) ||
        (catalogRootLink && catalogRootLink.url === action.url)) {
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
              url: state.data.selfUrl || state.data.url,
              text: state.data.title,
              id: state.data.id
            });
          }
        }
      }

      if (catalogRootLink) {
        let catalogRootUrlInHistory = newHistory.find((link) => {
          return link.url === catalogRootLink.url;
        });

        if (!catalogRootUrlInHistory) {
          newHistory = [{
            text: catalogRootLink.text || "Catalog",
            url: catalogRootLink.url,
            id: null
          }];
        }
      }
    }
  }

  return newHistory;
}