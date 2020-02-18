import * as React from "react";
import CatalogLink from "./CatalogLink";
import { FacetGroupData } from "../interfaces";

export interface FacetGroupProps {
  facetGroup: FacetGroupData;
}

/** Renders a single facet group in the left sidebar of a collection, such as
    options for sorting or filtering. */
export default class FacetGroup extends React.Component<FacetGroupProps, {}> {
  render(): JSX.Element {
    return (
      <div className="facet-group">
        <h3 className="facet-group-label">{this.props.facetGroup.label}</h3>
        <ul
          aria-label={this.props.facetGroup.label + " options"}
          className="subtle-list"
        >
          {this.props.facetGroup.facets.map(facet => (
            <li
              key={facet.label}
              className={facet.active ? "active" : undefined}
            >
              <CatalogLink className="facetLink" collectionUrl={facet.href}>
                {facet.label}
              </CatalogLink>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
