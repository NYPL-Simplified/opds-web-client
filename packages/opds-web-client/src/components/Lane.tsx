import * as React from "react";
import LaneBook from "./LaneBook";
import CatalogLink from "./CatalogLink";
import LaneMoreLink from "./LaneMoreLink";
import { LaneData } from "../interfaces";

export interface LaneProps {
  lane: LaneData;
  collectionUrl?: string;
}

export default class Lane extends React.Component<LaneProps, any> {
  render(): JSX.Element {
    let laneBooksStyle = {
      display: "block",
      height: "260px",
      width: "100%",
      whiteSpace: "nowrap",
      overflowX: "scroll",
      overflowY: "hidden",
      padding: 0,
      margin: 0,
      listStyleType: "none"
    };

    return (
      <div className="lane">
        <h2 style={{ clear: "both", cursor: "pointer" }}>
          <CatalogLink
            className="laneTitle"
            collectionUrl={this.props.lane.url}>
            {this.props.lane.title}
          </CatalogLink>
        </h2>

        { this.props.lane.books &&
          <ul className="laneBooks" aria-label={"books in " + this.props.lane.title} style={laneBooksStyle}>
            { this.props.lane.books.map(book =>
              <li key={book.id} style={{ display: "inline-block" }}>
                <LaneBook
                  book={book}
                  collectionUrl={this.props.collectionUrl}
                  />
              </li>
            ) }
            <li key="more" style={{ display: "inline-block" }}>
              <LaneMoreLink lane={this.props.lane} />
            </li>
          </ul>
        }
      </div>
    );
  }
}