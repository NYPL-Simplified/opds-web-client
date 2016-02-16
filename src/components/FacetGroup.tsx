import * as React from "react";
import Facet from "./Facet";

export default class FacetGroup extends React.Component<FacetGroupProps, any> {
  render(): JSX.Element {
    return (
      <div style={{ padding: "10px" }}>
        <b className="facet-group-label">{this.props.facetGroup.label}:</b>
        {this.props.facetGroup.facets.map(facet =>
          <Facet key={facet.label} facet={facet} setCollection={this.props.setCollection} />
        )}
      </div>
    );
  }
}