import * as React from "react";
import "../stylesheets/lane_book.scss";
import Book from "./Book";
import CatalogLink from "./CatalogLink";
import BookCover from "./BookCover";

export default class LaneBook extends Book {
  render(): JSX.Element {
    return (
      <div className="lane-book">
        <CatalogLink
          collectionUrl={this.props.collectionUrl}
          bookUrl={this.props.book.url}
          >
          <BookCover book={this.props.book} />
          <div className="info">
            <div className="title">{this.props.book.title}</div>
          </div>
        </CatalogLink>
      </div>
    );
  }
}