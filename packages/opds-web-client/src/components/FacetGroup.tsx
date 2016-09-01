import * as React from "react";
import "../stylesheets/facet_group.scss";
import "../stylesheets/subtle_list.scss";
import CatalogLink from "./CatalogLink";
import { FacetGroupData } from "../interfaces";
import { subtleListStyle } from "./styles";

export interface FacetGroupProps {
  facetGroup: FacetGroupData;
}

export default class FacetGroup extends React.Component<FacetGroupProps, any> {
  render(): JSX.Element {
    return (
      <div className="facet-group">
        <h3 className="facet-group-label">{this.props.facetGroup.label}:</h3>
        <ul aria-label={this.props.facetGroup.label + " options"} className="subtle-list">
        { this.props.facetGroup.facets.map(facet =>
          <li key={facet.label} className={facet.active ? "active" : null}>
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