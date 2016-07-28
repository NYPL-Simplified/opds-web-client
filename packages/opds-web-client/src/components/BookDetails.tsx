import * as React from "react";
import BorrowButton from "./BorrowButton";
import FulfillButton from "./FulfillButton";
import { BookProps } from "./Book";
import { BookData } from "../interfaces";
const download = require("downloadjs");

export interface BookDetailsProps extends BookProps {
  borrowBook: (url: string) => Promise<BookData>;
  fulfillBook: (url: string) => Promise<any>;
  isSignedIn: boolean;
}

export default class BookDetails extends React.Component<BookDetailsProps, any> {
  constructor(props) {
    super(props);
    this.borrow = this.borrow.bind(this);
  }

  render(): JSX.Element {
    let bookSummaryStyle = {
      paddingTop: "2em",
      borderTop: "1px solid #ccc"
    };

    let links = this.circulationLinks();

    return (
      <div className="bookDetails">
        <div className="bookDetailsTop" style={{ textAlign: "left", display: "table-row" }}>
          { this.props.book.imageUrl &&
            <div className="bookImage" style={{ display: "table-cell", paddingRight: "20px", verticalAlign: "top" }}>
              <img src={this.props.book.imageUrl} style={{ height: "150px" }}/>
            </div>
          }
          <div className="bookDetailsHeader" style={{ display: "table-cell", verticalAlign: "top", textAlign: "left", maxWidth: "500px" }}>
            <h1 className="bookDetailsTitle" style={{ margin: 0 }}>{this.props.book.title}</h1>
            {
              this.props.book.authors && this.props.book.authors.length ?
              <h2 className="bookDetailsAuthors" style={{ marginTop: "0.5em", fontSize: "1.2em" }}>{this.props.book.authors.join(", ")}</h2> :
              ""
            }
            {
              this.props.book.contributors && this.props.book.contributors.length ?
              <h2 className="bookDetailsContributors" style={{ marginTop: "0.5em", fontSize: "1.2em" }}>Contributors: {this.props.book.contributors.join(", ")}</h2> :
              ""
            }
            <div style={{ marginTop: "2em", color: "#888", fontSize: "0.9em" }}>
              { this.props.book.published &&
                <div className="bookDetailsPublished">Published: {this.props.book.published}</div>
              }
              {
                this.props.book.publisher ?
                <div className="bookDetailsPublisher">Publisher: {this.props.book.publisher}</div> :
                ""
              }
              {
                this.props.book.categories && this.props.book.categories.length ?
                <div className="bookDetailsCategories">Categories: {this.props.book.categories.join(", ")}</div> :
                ""
              }
            </div>
          </div>
        </div>
        <div style={{ clear: "both", marginTop: "1em" }}></div>
        <div
          style={bookSummaryStyle}>
          { links.length > 0 &&
            <div style={{textAlign: "center", marginBottom: "30px"}}>
              { links }
            </div>
          }
          <div className="bookDetailsSummary"
               dangerouslySetInnerHTML={{ __html: this.props.book.summary }}></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.setBodyOverflow("hidden");
  }

  componentWillUnmount() {
    this.setBodyOverflow("visible");
  }

  setBodyOverflow(value: string) {
    let elem = document.getElementsByTagName("body")[0] as HTMLElement;

    if (elem) {
      elem.style.overflow = value;
    }
  }

  circulationLinks() {
    let links = [];

    if (
      this.props.book.openAccessLinks &&
      this.props.book.openAccessLinks.length > 0
    ) {
      links.push(
        this.props.book.openAccessLinks.map(link => {
          let label = this.mimeTypeToDownloadLabel(link.type);
          return (<a
            key={link.url}
            className="btn btn-default"
            style={{ marginRight: "0.5em" }}
            href={link.url}
            target="_blank">
            {label}
          </a>);
        })
      );
    } else if (
      this.props.book.fulfillmentLinks &&
      this.props.book.fulfillmentLinks.length > 0
    ) {
      links.push(
        this.props.book.fulfillmentLinks.map(link => {
          let label = this.mimeTypeToDownloadLabel(link.type);
          return (
            <FulfillButton
              key={link.url}
              style={{ marginRight: "0.5em" }}
              fulfill={this.props.fulfillBook}
              url={link.url}
              mimeType={link.type}
              title={this.props.book.title}
              isSignedIn={this.props.isSignedIn}>
              {label}
            </FulfillButton>
          );
        })
      );
    }

    if (this.isBorrowed()) {
      links.push(
        <button className="btn btn-default disabled">On Hold</button>
      );
    } else if (this.props.book.borrowUrl) {
      let label = this.props.book.copies &&
                  this.props.book.copies.available === 0 ?
                  "Hold" :
                  "Borrow";
      links.push(
        <BorrowButton
          key={this.props.book.borrowUrl}
          style={{ marginRight: "0.5em" }}
          borrow={this.borrow}>
          { label }
        </BorrowButton>
      );
    }

    return links;
  }

  borrow(): Promise<BookData> {
    return this.props.borrowBook(this.props.book.borrowUrl);
  }

  mimeTypeToDownloadLabel(mimeType) {
    switch(mimeType) {
      case "application/epub+zip":
        return "Download EPUB";
      case "application/pdf":
        return "Download PDF";
      case "application/vnd.adobe.adept+xml":
        return "Download ACSM";
      case "vnd.adobe/adept+xml":
        return "Download ACSM";
      case "application/x-mobipocket-ebook":
        return "Download MOBI";
      default:
        return "Download";
    }
  }

  isBorrowed() {
    return this.props.book.availability &&
           this.props.book.availability.status === "reserved";
  }
}