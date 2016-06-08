import * as React from "react";
import LaneBook from "./LaneBook";
import CatalogLink from "./CatalogLink";
import BookCover from "./BookCover";
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

    let moreLinkStyle = {
      display: "block",
      height: "250px",
      whiteSpace: "normal", // overrides laneBookStyle
      textDecoration: "none"
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
              <CatalogLink
                className="moreLink"
                style={moreLinkStyle}
                collectionUrl={this.props.lane.url}>
                <BookCover
                  style={{ width: "150px", height: "200px" }}
                  text={"More\n" + this.props.lane.title} />
              </CatalogLink>
            </li>
          </ul>
        }
      </div>
    );
  }
}