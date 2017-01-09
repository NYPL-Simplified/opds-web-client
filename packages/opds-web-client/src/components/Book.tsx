import * as React from "react";
import CatalogLink from "./CatalogLink";
import BookCover from "./BookCover";
import { BookData } from "../interfaces";

export interface BookProps {
  book: BookData;
  collectionUrl?: string;
}

export default class Book extends React.Component<BookProps, any> {
  render(): JSX.Element {
    return (
      <div className="book" lang={this.props.book.language}>
        <CatalogLink
          collectionUrl={this.props.collectionUrl}
          bookUrl={this.props.book.url || this.props.book.id}
          title={this.props.book.title}
          >
          <BookCover book={this.props.book} />
          <div className="info">
            <div className="title">{this.props.book.title}</div>
            <div className="authors">
              {
                this.props.book.authors.length ?
                this.props.book.authors.join(", ") :
                  this.props.book.contributors && this.props.book.contributors.length ?
                  this.props.book.contributors.join(", ") :
                  ""
              }
            </div>
          </div>
        </CatalogLink>
      </div>
    );
  }
}