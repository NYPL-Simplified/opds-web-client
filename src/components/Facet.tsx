import * as React from 'react';
import CollectionLink from "./CollectionLink";

export default class Facet extends React.Component<FacetProps, any> {
  render() : JSX.Element {
    let facetStyle: any = {
      cursor: "pointer"
    };
    if (this.props.active) {
      facetStyle.backgroundColor = "#ddd";
    }

    return (
      <div style={facetStyle}>
        <CollectionLink text={this.props.label} url={this.props.href} fetchCollection={this.props.fetchCollection} />
      </div>
    );
  }
}