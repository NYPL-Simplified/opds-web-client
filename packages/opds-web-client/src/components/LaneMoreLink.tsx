import * as React from "react";
import CatalogLink from "./CatalogLink"

export default class LaneMoreLink extends React.Component<any, any> {
  render() {
    let cellStyle = Object.assign({
      display: "table-cell",
      verticalAlign: "middle",
      backgroundColor: "#eee",
      textAlign: "center",
      padding: "10px",
      color: "#888",
      fontWeight: "bold",
      width: "150px",
      height: "200px"
    }, this.computeFontStyle(), this.props.style);

    let moreLinkStyle = {
      display: "block",
      height: "250px",
      whiteSpace: "normal", // overrides laneBookStyle
      textDecoration: "none"
    };

    return (
      <CatalogLink
        className="moreLink"
        style={moreLinkStyle}
        collectionUrl={this.props.lane.url}>
        <div style={cellStyle}>
          More<br />{ this.props.lane.title }
        </div>
      </CatalogLink>
    );
  }

  computeFontStyle() {
    let words = this.props.lane.title.split(/\s/);
    let wordCount = words.length;
    let maxLength = Math.max(...words.map(word => word.length));
    let fontSize = Math.max(15, 43 - maxLength * 2 - Math.max(0, wordCount - 3) * 2);
    let lineHeight = fontSize + 5;

    return {
      fontSize: fontSize + "px",
      lineHeight: "1.1em"
    };
  }
}