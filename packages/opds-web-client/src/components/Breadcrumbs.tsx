import * as React from "react";
import CatalogLink from "./CatalogLink";
import { CollectionData, LinkData } from "../interfaces";

export interface BreadcrumbsProps extends React.Props<{}> {
  links: LinkData[];
  currentLink?: boolean;
}

export interface ComputeBreadcrumbs {
  (
    collection: CollectionData | null | undefined,
    history: LinkData[] | null | undefined
  ): LinkData[];
}

/**
 * Shows a list of breadcrumbs links above a collection.
 **/
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  links,
  currentLink = false
}) => (
  <nav aria-label="breadcrumbs" role="navigation">
    <ol className="breadcrumbs">
      {links &&
        links.map((link, i) => (
          <li key={link.url} className="breadcrumb">
            {i === links.length - 1 && !currentLink ? (
              <span>{link.text}</span>
            ) : (
              <CatalogLink collectionUrl={link.url} bookUrl={null}>
                {link.text}
              </CatalogLink>
            )}
          </li>
        ))}
    </ol>
  </nav>
);

export default Breadcrumbs;

/**
 * Computes breadcrumbs based on the browser history, with the current
 * collection as the final element.
 **/
export function defaultComputeBreadcrumbs(
  collection: CollectionData,
  history: LinkData[]
): LinkData[] {
  let links = history ? history.slice(0) : [];

  if (collection) {
    links.push({
      url: collection.url,
      text: collection.title
    });
  }

  return links;
}

/**
 * Computes breadcrumbs assuming that the OPDS feed is hierarchical - uses
 * the catalog root link, the parent of the current collection if it's not
 * the root, and the current collection. The OPDS spec doesn't require a
 * hierarchy, so this may not make sense for some feeds.
 * */
export function hierarchyComputeBreadcrumbs(
  collection: CollectionData,
  history: LinkData[],
  comparator?: (url1: string, url2: string) => boolean
): LinkData[] {
  let links: LinkData[] = [];

  if (!collection) {
    return [];
  }

  if (!comparator) {
    comparator = (url1, url2) => url1 === url2;
  }

  let { catalogRootLink, parentLink } = collection;

  if (catalogRootLink && !comparator(catalogRootLink.url, collection.url)) {
    links.push({
      text: catalogRootLink.text || "Catalog",
      url: catalogRootLink.url
    });
  }

  if (
    parentLink &&
    parentLink.url &&
    parentLink.text &&
    (!catalogRootLink || !comparator(parentLink.url, catalogRootLink.url)) &&
    !comparator(parentLink.url, collection.url)
  ) {
    links.push({
      text: parentLink.text,
      url: parentLink.url
    });
  }

  links.push({
    url: collection.url,
    text: collection.title
  });

  return links;
}
