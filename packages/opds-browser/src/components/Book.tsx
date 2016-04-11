import * as React from "react";
import BookPreviewLink from "./BookPreviewLink";

export interface BookProps extends BookActionProps, BaseProps {
  book: BookData;
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
          url={this.props.book.url}
          book={this.props.book}
          navigate={this.props.navigate}
          pathFor={this.props.pathFor}
          collectionUrl={this.props.collectionUrl}
          style={{ color: "black", textDecoration: "none" }}>
          <img src={this.props.book.imageUrl} style={bookCoverStyle} alt=""/>
          <div className="bookInfo" style={ bookInfoStyle }>
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
          </div>
        </BookPreviewLink>
      </div>
    );
  }
}