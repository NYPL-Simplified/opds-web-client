import * as React from "react";
import BrowserLink from "./BrowserLink";
import { CollectionData, LinkData } from "../interfaces";
import { subtleListStyle } from "./styles";

export interface BreadcrumbsProps {
  mode: BreadcrumbMode;
  history: LinkData[];
  hierarchy: LinkData[];
  collection: CollectionData;
  showCurrentLink?: Boolean;
}

export type BreadcrumbMode = "history" | "hierarchy";

export default class Breadcrumbs extends React.Component<BreadcrumbsProps, any> {
  render(): JSX.Element {
    let linkStyle = {
      fontSize: "1.2em",
      marginRight: "5px",
      cursor: "pointer"
    };

    let currentCollectionStyle = {
      fontWeight: "bold"
    };

    return (
        <ol className="breadcrumb" style={{ fontSize: "1.2em", height: "40px" }} aria-label="breadcrumbs" role="navigation">
          { this.props.history && this.props.history.map(breadcrumb =>
            <li key={breadcrumb.id}>
              <BrowserLink
                collectionUrl={breadcrumb.url}
                bookUrl={null}>
                { breadcrumb.text }
              </BrowserLink>
            </li>
          ) }

          <li className="currentCollection" style={currentCollectionStyle}>
            { this.props.showCurrentLink ?
              <BrowserLink
                className="currentCollectionLink"
                collectionUrl={this.props.collection.url}
                bookUrl={null}>
                {this.props.collection.title}
              </BrowserLink> :
              this.props.collection.title
            }
          </li>
        </ol>
    );
  }
}

