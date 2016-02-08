import * as React from 'react';

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
        <a onClick={() => this.props.fetchUrl(this.props.href)}>
          {this.props.label}
        </a>
      </div>
    );
  }
}