import * as React from "react";
import "../stylesheets/lane_more_link.scss";
import CatalogLink from "./CatalogLink";

export default class LaneMoreLink extends React.Component<any, any> {
  render() {
    let fontSize = this.computeFontSize();

    return (
      <CatalogLink
        className="more-link"
        collectionUrl={this.props.lane.url}>
        <div style={{ fontSize: fontSize }}>
          More<br />{ this.props.lane.title }
        </div>
      </CatalogLink>
    );
  }

  computeFontSize() {
    let words = this.props.lane.title.split(/\s/);
    let wordCount = words.length;
    let maxLength = Math.max(...words.map(word => word.length));
    let fontSize = Math.max(15, 43 - maxLength * 2 - Math.max(0, wordCount - 3) * 2);
    return fontSize + "px";
  }
}