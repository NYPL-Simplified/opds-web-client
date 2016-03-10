import * as React from "react";
import CollectionLink from "./CollectionLink";
import { subtleListStyle } from "./styles";

export default class Breadcrumbs extends React.Component<BreadcrumbsProps, any> {
  render(): JSX.Element {
    let height = this.props.navHeight;
    let top = this.props.navTop;
    let padding = this.props.padding || 10;

    let navStyle = {
      height: `${height}px`,
      position: "fixed",
      top: `${top}px`,
      width: "100%",
      backgroundColor: "#fff",
      borderBottom: "1px solid #eee",
      paddingTop: `${padding}px`,
      paddingLeft: `${padding}px`
    };

    let linkStyle = {
      fontSize: "1.2em",
      marginRight: "5px",
      cursor: "pointer"
    };

    return (
      <nav aria-label="breadcrumbs" role="navigation" style={ navStyle }>
        <ul style={subtleListStyle}>
          { this.props.history.map(breadcrumb =>
            <li style={{ listStyle: "none", float: "left", marginRight: "5px" }} key={breadcrumb.id}>
              <CollectionLink
                text={breadcrumb.text}
                url={breadcrumb.url}
                pathFor={this.props.pathFor}
                setCollectionAndBook={this.props.setCollectionAndBook}
                style={linkStyle} />
              ›
            </li>
          )}

          <li className="currentCollection" style={{ listStyle: "none", float: "left", fontSize: (this.props.showCurrentLink ? null : "1.2em") }}>
            { this.props.showCurrentLink ?
              <CollectionLink
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

