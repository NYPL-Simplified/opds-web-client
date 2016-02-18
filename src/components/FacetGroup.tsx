import * as React from "react";
import Facet from "./Facet";

export default class FacetGroup extends React.Component<FacetGroupProps, any> {
  render(): JSX.Element {
    let id = "collectionFacetGroup-" + this.props.facetGroup.label.replace(/\s/, "");

    return (
      <div style={{ padding: "10px" }}>
        <h3 id={id} className="facet-group-label" style={{ margin: 0, fontSize: "1em" }}>{this.props.facetGroup.label}:</h3>
        <ul aria-labelledby={id} style={{ padding: 0, margin: 0, listStyleType: "none" }}>
        {this.props.facetGroup.facets.map(facet =>
          <Facet key={facet.label} facet={facet} setCollection={this.props.setCollection} />
        )}
        </ul>
      </div>
    );
  }
}