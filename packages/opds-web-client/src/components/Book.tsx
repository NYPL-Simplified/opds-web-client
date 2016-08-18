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
    let bookStyle = {
      whiteSpace: "normal", // overrides Lane's laneBooks style
      marginRight: "10px",
      marginBottom: "10px",
      overflow: "hidden",
      height: "200px",
      float: "left",
      textAlign: "center"
    };

    let bookInfoStyle = {
      width: "160px",
      textAlign: "left",
      marginTop: "15px",
      marginLeft: "5px",
      float: "left"
    };

    let bookTitleStyle = {
      fontSize: "1.2em",
      fontWeight: "bold",
      marginBottom: "5px"
    };

    let bookLinksStyle = {
      marginTop: "10px"
    };

    return (
      <div className="book" style={ bookStyle }>
        <CatalogLink
          collectionUrl={this.props.collectionUrl}
          bookUrl={this.props.book.url || this.props.book.id}
          style={{ color: "black", textDecoration: "none" }}>
          <BookCover book={this.props.book} />
        </CatalogLink>
        <div className="bookInfo" style={ bookInfoStyle }>
          <CatalogLink
            collectionUrl={this.props.collectionUrl}
            bookUrl={this.props.book.url || this.props.book.id}
            style={{ color: "black", textDecoration: "none" }}>
              <div className="bookTitle" style={ bookTitleStyle }>{this.props.book.title}</div>
              <div className="bookAuthors">
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
            <div className="bookLinks" style={bookLinksStyle}>
              <a href={this.props.book.openAccessLinks[0].url} className="btn btn-default">Download</a>
            </div> : null
          }
        </div>
      </div>
    );
  }
}