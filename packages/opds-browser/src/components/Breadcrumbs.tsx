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
      fontWeight: "bold"
    };

    return (
        <ol className="breadcrumb" style={{ fontSize: "1.2em" }}>
          { this.props.history && this.props.history.map(breadcrumb =>
            <li key={breadcrumb.id}>
              <CollectionLink
                text={breadcrumb.text}
                url={breadcrumb.url}
                pathFor={this.props.pathFor}
                setCollectionAndBook={this.props.setCollectionAndBook} />
            </li>
          ) }

          <li className="currentCollection" style={currentCollectionStyle}>
            { this.props.showCurrentLink ?
              <CollectionLink
                className="currentCollectionLink"
                text={this.props.collection.title}
                url={this.props.collection.url}
                pathFor={this.props.pathFor}
                setCollectionAndBook={this.props.setCollectionAndBook}/> :
              this.props.collection.title
            }
          </li>
        </ol>
    );
  }
}

