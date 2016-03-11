import * as React from "react";
import CollectionLink from "./CollectionLink";
import { subtleListStyle } from "./styles";

export default class Breadcrumbs extends React.Component<BreadcrumbsProps, any> {
  render(): JSX.Element {
    let linkStyle = {
      fontSize: "1.2em",
      marginRight: "5px",
      cursor: "pointer"
    };

    let currentCollectionStyle = {
      listStyle: "none",
      float: "left",
      fontSize: (this.props.showCurrentLink ? null : "1.2em"),
      fontWeight: "bold"
    };

    return (
      <nav className="breadcrumbs" aria-label="breadcrumbs" role="navigation">
        <ul style={subtleListStyle}>
          { this.props.history && this.props.history.map(breadcrumb =>
            <li style={{ listStyle: "none", float: "left", marginRight: "5px" }} key={breadcrumb.id}>
              <CollectionLink
                text={breadcrumb.text}
                url={breadcrumb.url}
                pathFor={this.props.pathFor}
                setCollectionAndBook={this.props.setCollectionAndBook}
                style={linkStyle} />
              ›
            </li>
          ) }

          <li className="currentCollection" style={currentCollectionStyle}>
            { this.props.showCurrentLink ?
              <CollectionLink
                className="currentCollectionLink"
                text={this.props.collection.title}
                url={this.props.collection.url}
                pathFor={this.props.pathFor}
                setCollectionAndBook={this.props.setCollectionAndBook}
                style={linkStyle} /> :
              this.props.collection.title
            }
          </li>
        </ul>
      </nav>
    );
  }
}

