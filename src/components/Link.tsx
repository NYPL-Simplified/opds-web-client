import * as React from "react";
import CollectionLink from "./CollectionLink";

export default class Link extends React.Component<LinkProps, any> {
  render(): JSX.Element {
    let linkStyle = {
      textAlign: "center",
      backgroundColor: "#ddd",
      margin: "25px",
      padding: "10px",
      overflow: "hidden",
      fontSize: "500%"
    };

    return (
      <div className="link" style={ linkStyle }>
        <CollectionLink text={this.props.title} url={this.props.href} fetchCollection={this.props.fetchCollection} />
      </div>
    );
  }
}