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
      <div className="book">
        <CatalogLink
          collectionUrl={this.props.collectionUrl}
          bookUrl={this.props.book.url || this.props.book.id}
          >
          <BookCover book={this.props.book} />
        </CatalogLink>
        <div className="info">
          <CatalogLink
            collectionUrl={this.props.collectionUrl}
            bookUrl={this.props.book.url || this.props.book.id}
            >
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
          </CatalogLink>
          { this.props.book.openAccessLinks && this.props.book.openAccessLinks.length ?
            <div className="links">
              <a href={this.props.book.openAccessLinks[0].url} className="btn btn-default">Download</a>
            </div> : null
          }
        </div>
      </div>
    );
  }
}