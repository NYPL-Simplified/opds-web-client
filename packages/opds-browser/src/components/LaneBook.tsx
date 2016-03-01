import * as React from "react";
import Book from "./Book";
import BookPreviewLink from "./BookPreviewLink";

export default class LaneBook extends Book {
  render(): JSX.Element {
    let bookStyle = {
      whiteSpace: "normal", // overrides laneBooks style
      marginRight: "10px",
      marginBottom: "10px",
      overflow: "hidden",
      display: "inline-block",
      height: "240px"
    };

    let bookCoverStyle = {
      width: "150px",
      height: "200px",
    };

    let bookInfoStyle = {
      clear: "left",
      width: "150px",
      textAlign: "center"
    };

    return (
      <div className="book laneBook" style={ bookStyle }>
        <BookPreviewLink
          className="laneBookLink"
          url={this.props.book.url}
          book={this.props.book}
          setBook={this.props.setBook}
          pathFor={this.props.pathFor}
          collectionUrl={this.props.collectionUrl}
          style={{ color: "black", textDecoration: "none" }}>
          <img src={this.props.book.imageUrl} style={bookCoverStyle} alt=""/>
          <div className="bookInfo" style={ bookInfoStyle }>
            <div className="bookTitle">{this.props.book.title}</div>
          </div>
        </BookPreviewLink>
      </div>
    );
  }
}