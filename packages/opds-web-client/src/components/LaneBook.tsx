import * as React from "react";
import Book from "./Book";
import CatalogLink from "./CatalogLink";
import BookCover from "./BookCover";

export default class LaneBook extends Book {
  render(): JSX.Element {
    let bookStyle = {
      whiteSpace: "normal", // overrides laneBooks style
      marginRight: "10px",
      overflow: "hidden",
      height: "250px"
    };

    let bookCoverStyle = {
      width: "150px",
      height: "200px"
    };

    let bookInfoStyle = {
      clear: "left",
      width: "150px",
      textAlign: "center",
      marginTop: "5px"
    };

    let coverStyle = {
      width: "150px",
      height: "200px",
      textAlign: "left",
      verticalAlign: "top"
    };

    return (
      <div className="book laneBook" style={ bookStyle }>
        <CatalogLink
          className="laneBookLink"
          collectionUrl={this.props.collectionUrl}
          bookUrl={this.props.book.url}
          book={this.props.book}
          style={{ color: "black", textDecoration: "none" }}>
          { this.props.book.imageUrl ?
            <img src={this.props.book.imageUrl} style={bookCoverStyle} alt=""/> :
            <BookCover
              style={coverStyle}
              text={this.props.book.title} />
          }
          <div className="bookInfo" style={ bookInfoStyle }>
            <div className="bookTitle">{this.props.book.title}</div>
          </div>
        </CatalogLink>
      </div>
    );
  }
}