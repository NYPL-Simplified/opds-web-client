import * as React from "react";
import CollectionLink from "./CollectionLink";
import { subtleListStyle } from "./styles";

export default class FacetGroup extends React.Component<FacetGroupProps, any> {
  render(): JSX.Element {
    return (
      <div style={{ padding: "10px" }}>
        <h3 className="facet-group-label" style={{ margin: 0 }}>{this.props.facetGroup.label}:</h3>
        <ul aria-label={this.props.facetGroup.label + " options"} style={subtleListStyle}>
        { this.props.facetGroup.facets.map(facet =>
          <li key={facet.label} style={facet.active ? { backgroundColor: "#ddd" } : null}>
            <CollectionLink
              className="facetLink"
              text={facet.label}
              url={facet.href}
              setCollectionAndBook={this.props.setCollectionAndBook}
              pathFor={this.props.pathFor} />
          </li>
        ) }
        </ul>
      </div>
    );
  }
}