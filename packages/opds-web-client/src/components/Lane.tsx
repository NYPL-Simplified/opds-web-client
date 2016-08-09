import * as React from "react";
import LaneBook from "./LaneBook";
import CatalogLink from "./CatalogLink";
import LaneMoreLink from "./LaneMoreLink";
import { LaneData, BookData } from "../interfaces";

export interface LaneProps {
  lane: LaneData;
  collectionUrl?: string;
  hideMoreLink?: boolean;
  hiddenBookIds?: string[];
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

    let visibleBooks = this.visibleBooks();

    if (visibleBooks.length === 0) {
      return null;
    }

    return (
      <div className="lane">
        <h2 style={{ clear: "both", cursor: "pointer" }}>
          <CatalogLink
            className="laneTitle"
            collectionUrl={this.props.lane.url}>
            {this.props.lane.title}
          </CatalogLink>
        </h2>

        <ul className="laneBooks" aria-label={"books in " + this.props.lane.title} style={laneBooksStyle}>
          { visibleBooks.map(book =>
            <li key={book.id} style={{ display: "inline-block" }}>
              <LaneBook
                book={book}
                collectionUrl={this.props.collectionUrl}
                />
            </li>
          ) }
          { !this.props.hideMoreLink &&
            <li key="more" style={{ display: "inline-block" }}>
              <LaneMoreLink lane={this.props.lane} />
            </li>
          }
        </ul>
      </div>
    );
  }

  visibleBooks(): BookData[] {
    if (!this.props.hiddenBookIds) {
      return this.props.lane.books;
    }

    return this.props.lane.books.filter(book =>
      this.props.hiddenBookIds.indexOf(book.id) === -1
    );
  }
}