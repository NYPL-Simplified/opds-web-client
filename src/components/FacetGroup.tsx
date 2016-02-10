import * as React from "react";
import Facet from "./Facet";

export default class FacetGroup extends React.Component<FacetGroupProps, any> {
  render(): JSX.Element {
    return (
      <div style={{ padding: "10px" }}>
        <b className="facet-group-label">{this.props.label}:</b>
        {this.props.facets.map(facet =>
          <Facet key={facet.label} {...facet} fetchCollection={this.props.fetchCollection} />
        )}
      </div>
    );
  }
}