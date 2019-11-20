import * as React from "react";
import CatalogLink from "./CatalogLink";
import { LaneData } from "../interfaces";

export interface LaneMoreLinkProps {
  lane: LaneData;
}

/** The link at the far right of a lane that goes to the full feed for that lane. */
export default class LaneMoreLink extends React.Component<
  LaneMoreLinkProps,
  {}
> {
  render() {
    let fontSize = this.computeFontSize();

    return (
      <div className="book">
        <CatalogLink className="more-link" collectionUrl={this.props.lane.url}>
          <div style={{ fontSize: fontSize }}>
            More
            <br />
            {this.props.lane.title}
          </div>
        </CatalogLink>
      </div>
    );
  }

  computeFontSize() {
    let words = this.props.lane.title.split(/\s/);
    let wordCount = words.length;
    let maxLength = Math.max(...words.map(word => word.length));
    let fontSize = Math.max(
      15,
      43 - maxLength * 2 - Math.max(0, wordCount - 3) * 2
    );
    return fontSize + "px";
  }
}
