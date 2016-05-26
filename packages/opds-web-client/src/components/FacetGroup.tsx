import * as React from "react";
import CatalogLink from "./CatalogLink";
import { FacetGroupData } from "../interfaces";
import { subtleListStyle } from "./styles";

export interface FacetGroupProps {
  facetGroup: FacetGroupData;
}

export default class FacetGroup extends React.Component<FacetGroupProps, any> {
  render(): JSX.Element {
    return (
      <div style={{ padding: "10px" }}>
        <h3 className="facet-group-label" style={{ margin: 0 }}>{this.props.facetGroup.label}:</h3>
        <ul aria-label={this.props.facetGroup.label + " options"} style={subtleListStyle}>
        { this.props.facetGroup.facets.map(facet =>
          <li key={facet.label} style={facet.active ? { backgroundColor: "#ddd" } : null}>
            <CatalogLink
              className="facetLink"
              collectionUrl={facet.href}>
              {facet.label}
            </CatalogLink>
          </li>
        ) }
        </ul>
      </div>
    );
  }
}