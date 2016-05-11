import * as React from "react";
import BrowserLink from "./BrowserLink";
import { CollectionData, BookData, LinkData } from "../interfaces";

export interface BreadcrumbsProps extends React.Props<any> {
  links: LinkData[];
}

export interface ComputeBreadcrumbs {
  (collection: CollectionData, history: LinkData[]): LinkData[];
}

export default class Breadcrumbs extends React.Component<BreadcrumbsProps, any> {
  render(): JSX.Element {
    let linkStyle = {
      fontSize: "1.2em",
      marginRight: "5px",
      cursor: "pointer"
    };

    return (
        <ol className="breadcrumb" style={{ fontSize: "1.2em", height: "40px" }} aria-label="breadcrumbs" role="navigation">
          { this.props.links && this.props.links.map((link, i) =>
            <li key={link.url}>
              <BrowserLink
                collectionUrl={link.url}
                bookUrl={null}>
                { i === this.props.links.length - 1 ? <strong>{link.text}</strong> : link.text }
              </BrowserLink>
            </li>
          ) }
        </ol>
    );
  }
}

export function defaultComputeBreadcrumbs(collection: CollectionData, history: LinkData[]): LinkData[] {
  let links = history ? history.slice(0) : [];

  if (collection) {
    links.push({
      url: collection.url,
      text: collection.title
    });
  }

  return links;
}

export function hierarchyComputeBreadcrumbs(collection: CollectionData, history: LinkData[]): LinkData[] {
  let links = [];

  if (!collection) {
    return [];
  }

  let { catalogRootLink, parentLink } = collection;

  if (catalogRootLink && catalogRootLink.url !== collection.url) {
    links.push({
      text: catalogRootLink.text || "Catalog",
      url: catalogRootLink.url
    });
  }

  if (parentLink && parentLink.url && parentLink.text &&
      (!catalogRootLink || parentLink.url !== catalogRootLink.url) &&
      parentLink.url !== collection.url) {
    links.push({
      text: parentLink.text,
      url: parentLink.url
    });
  }

  return links;
};