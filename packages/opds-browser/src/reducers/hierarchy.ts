import { LinkData } from "../interfaces";
import { LoadCollectionAction } from "../actions";

export default (state: LinkData[], action: LoadCollectionAction) => {
  let hierarchy = [];

  let { catalogRootLink, parentLink } = action.data;

  if (catalogRootLink && catalogRootLink.url !== action.url) {
    hierarchy.push({
      text: catalogRootLink.text || "Catalog",
      url: catalogRootLink.url
    });
  }

  if (parentLink && parentLink.url && parentLink.text &&
      (!catalogRootLink || parentLink.url !== catalogRootLink.url) &&
      parentLink.url !== action.url) {
    hierarchy.push({
      text: parentLink.text,
      url: parentLink.url
    });
  }

  return hierarchy;
};