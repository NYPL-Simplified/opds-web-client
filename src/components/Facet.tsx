import * as React from "react";
import CollectionLink from "./CollectionLink";

export default class Facet extends React.Component<FacetProps, any> {
  render(): JSX.Element {
    let facetStyle = this.props.facet.active ? {
      backgroundColor: "#ddd"
    } : null;

    return (
      <li style={facetStyle}>
        <CollectionLink text={this.props.facet.label} url={this.props.facet.href} setCollection={this.props.setCollection} />
      </li>
    );
  }
}