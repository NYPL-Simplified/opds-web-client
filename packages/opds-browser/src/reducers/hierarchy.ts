import { CollectionState } from "./collection";
import { LoadCollectionAction } from "../actions";

export default (state: CollectionState, action: LoadCollectionAction) => {
  let hierarchy = [];

  let { catalogRootUrl, parentLink } = action.data

  if (catalogRootUrl &&catalogRootUrl !== action.url) {
    hierarchy.push({
      text: "Catalog",
      url: catalogRootUrl
    });
  }

  if (parentLink && parentLink.url && parentLink.text &&
      parentLink.url !== catalogRootUrl.url &&
      parentLink.url !== action.url) {
    hierarchy.push({
      text: parentLink.text,
      url: parentLink.url
    });
  }

  return hierarchy;
}