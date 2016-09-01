import * as React from "react";
import "../stylesheets/lane.scss";
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
    let visibleBooks = this.visibleBooks();

    if (visibleBooks.length === 0) {
      return null;
    }

    return (
      <div className="lane">
        <h2>
          <CatalogLink
            className="title"
            collectionUrl={this.props.lane.url}>
            {this.props.lane.title}
          </CatalogLink>
        </h2>

        <ul className="lane-books" aria-label={"books in " + this.props.lane.title}>
          { visibleBooks.map(book =>
            <li key={book.id}>
              <LaneBook
                book={book}
                collectionUrl={this.props.collectionUrl}
                />
            </li>
          ) }
          { !this.props.hideMoreLink &&
            <li key="more">
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