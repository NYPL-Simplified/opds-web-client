import * as React from "react";
import CatalogLink from "./CatalogLink";
import BookCover, { seededRandomHue } from "./BookCover";
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

    let bookLinksStyle = {
      marginTop: "10px"
    };

    let hue = seededRandomHue(this.props.book.title);
    let bgColorBottom = `hsla(${hue}, 100%, 30%, 1)`;
    let bgColorTop = `hsla(${hue}, 100%, 15%, 1)`;
    // let bgColor = `-webkit-linear-gradient(top, ${bgColorTop} 0%, ${bgColorBottom} 100%)`;
    let bgColor = `hsla(${hue}, 50%, 30%, 1)`;

    let autoCoverStyle = {
      float: "left",
      width: "150px",
      height: "200px",
      textAlign: "left",
      verticalAlign: "top",
      padding: "10px",
      backgroundColor: bgColor,
      fontSize: "35px",
      color: "#fff",
      fontWeight: "bold"
    };

    return (
      <div className="book" style={ bookStyle }>
        <CatalogLink
          collectionUrl={this.props.collectionUrl}
          bookUrl={this.props.book.url || this.props.book.id}
          style={{ color: "black", textDecoration: "none" }}>
          { this.props.book.imageUrl ?
            <img src={this.props.book.imageUrl} style={bookCoverStyle} alt=""/> :
            <BookCover
              style={autoCoverStyle}
              text={this.props.book.title} />
          }
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
          { this.props.book.openAccessUrl &&
            <div className="bookLinks" style={bookLinksStyle}>
              <a href={this.props.book.openAccessUrl} className="btn btn-default">Get</a>
            </div>
          }
        </div>
      </div>
    );
  }
}