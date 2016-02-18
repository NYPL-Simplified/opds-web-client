import * as React from "react";
import CollectionLink from "./CollectionLink";

export default class Facet extends React.Component<FacetProps, any> {
  render(): JSX.Element {
    let facetStyle: any = {
      cursor: "pointer"
    };
    if (this.props.facet.active) {
      facetStyle.backgroundColor = "#ddd";
    }

    return (
      <div style={facetStyle}>
        <CollectionLink text={this.props.facet.label} url={this.props.facet.href} setCollection={this.props.setCollection} />
      </div>
    );
  }
}