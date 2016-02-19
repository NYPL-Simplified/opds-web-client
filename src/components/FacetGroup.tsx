import * as React from "react";
import Facet from "./Facet";
import { subtleListStyle } from "./styles";

export default class FacetGroup extends React.Component<FacetGroupProps, any> {
  render(): JSX.Element {
    return (
      <div style={{ padding: "10px" }}>
        <h3 className="facet-group-label" style={{ margin: 0, fontSize: "1em" }}>{this.props.facetGroup.label}:</h3>
        <ul aria-label={this.props.facetGroup.label + " options"} style={subtleListStyle}>
        {this.props.facetGroup.facets.map(facet =>
          <Facet key={facet.label} facet={facet} setCollection={this.props.setCollection} />
        )}
        </ul>
      </div>
    );
  }
}