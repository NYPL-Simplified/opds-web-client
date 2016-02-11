import * as React from "react";
import BookPreviewLink from "./BookPreviewLink";

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

    let bookCoverStyle = {
      width: "150px",
      height: "200px",
      float: "left"
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

    return (
      <div className="book" style={ bookStyle }>
        <BookPreviewLink
          url={this.props.url}
          collectionUrl={this.props.collectionUrl}
          book={this.props}
          showBookDetails={this.props.showBookDetails}
          style={{ color: "black", textDecoration: "none" }}>
          <img src={this.props.imageUrl} style={bookCoverStyle} />
          <div className="bookInfo" style={ bookInfoStyle }>
            <div className="bookTitle" style={ bookTitleStyle }>{this.props.title}</div>
            <div className="bookAuthors">{this.props.authors.join(", ")}</div>
          </div>
        </BookPreviewLink>
      </div>
    );
  }
}