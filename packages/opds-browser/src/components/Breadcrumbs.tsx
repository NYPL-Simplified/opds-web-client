import * as React from "react";
import BrowserLink from "./BrowserLink";
import { CollectionData, BookData, LinkData } from "../interfaces";

export interface BreadcrumbsProps extends React.Props<any> {
  links: LinkData[];
}

export interface DataForBreadcrumbs {
  history: LinkData[];
  hierarchy: LinkData[];
  collection: CollectionData;
}

export interface ComputeBreadcrumbs {
  (data: DataForBreadcrumbs): LinkData[];
}

export function defaultComputeBreadcrumbs(data: DataForBreadcrumbs): LinkData[] {
  let history = data.history ? data.history.slice(0) : [];

  if (data.collection) {
    history.push({
      url: data.collection.url,
      text: data.collection.title
    });
  }

  return history;
}

export default class Breadcrumbs extends React.Component<BreadcrumbsProps, any> {
  render(): JSX.Element {
    let linkStyle = {
      fontSize: "1.2em",
      marginRight: "5px",
      cursor: "pointer"
    };

    let parentLinks = this.props.links.slice(0, -1);
    let currentLink = this.props.links.slice(-1)[0];

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

