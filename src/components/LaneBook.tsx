import * as React from "react";
import Book from "./Book";
import BookLink from "./BookLink";

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
        <BookLink book={this.props} showBookDetails={this.props.showBookDetails}>
          <img src={this.props.imageUrl} style={bookCoverStyle} />
        </BookLink>
        <div className="bookInfo" style={ bookInfoStyle }>
          <div className="bookTitle">{this.props.title}</div>
        </div>
      </div>
    );
  }
}