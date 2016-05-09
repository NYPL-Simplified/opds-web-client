import * as React from "react";
import LaneBook from "./LaneBook";
import BrowserLink from "./BrowserLink";
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
    console.log(this.props.lane.url);

    return (
      <div className="lane">
        <h2 style={{ clear: "both", cursor: "pointer" }}>
          <BrowserLink
            className="laneTitle"
            collectionUrl={this.props.lane.url}>
            {this.props.lane.title}
          </BrowserLink>
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
          </ul>
        }
      </div>
    );
  }
}