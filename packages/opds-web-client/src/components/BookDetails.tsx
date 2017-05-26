import * as React from "react";
import * as moment from "moment";
import CatalogLink from "./CatalogLink";
import BorrowButton from "./BorrowButton";
import DownloadButton from "./DownloadButton";
import BookCover from "./BookCover";
import { BookProps } from "./Book";
import { BookData } from "../interfaces";
const download = require("downloadjs");

export interface BookDetailsProps extends BookProps {
  updateBook: (url: string) => Promise<BookData>;
  fulfillBook: (url: string) => Promise<Blob>;
  indirectFulfillBook: (url: string, type: string) => Promise<string>;
  isSignedIn?: boolean;
  epubReaderUrlTemplate?: (epubUrl: string) => string;
}

export default class BookDetails<P extends BookDetailsProps> extends React.Component<P, void> {
  constructor(props) {
    super(props);
    this.borrow = this.borrow.bind(this);
  }

  render(): JSX.Element {
    let fields = this.fields();

    return (
      <div className="book-details">
        <div className="top" lang={this.props.book.language}>
          <div className="cover">
            <BookCover book={this.props.book} />
          </div>
          <div className="header">
            <h1 className="title">{this.props.book.title}</h1>
            {
              this.props.book.series && this.props.book.series.name ?
              <h3 className="series">{ this.props.book.series.name }</h3> :
              ""
            }
            {
              this.props.book.authors && this.props.book.authors.length ?
              <h2 className="authors">{this.props.book.authors.join(", ")}</h2> :
              ""
            }
            {
              this.props.book.contributors && this.props.book.contributors.length ?
              <h2 className="contributors">Contributors: {this.props.book.contributors.join(", ")}</h2> :
              ""
            }
            <div className="fields" lang="en">
              { this.fields().map(field =>
                field.value ? <div className={field.name.toLowerCase().replace(" ", "-")} key={field.name}>{field.name}: {field.value}</div> : null
              ) }
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div
          className="main">
          <div className="row">
            <div className="col-sm-3">
            </div>
            <div className="top col-sm-6">
              <div className="circulation-links">
                { this.circulationLinks() }
              </div>
              <div className="circulation-info">
                { this.circulationInfo() }
              </div>
            </div>
            <div className="right-column-links col-sm-3">
              { this.rightColumnLinks() }
            </div>
          </div>

          <div className="summary" lang={this.props.book.language}
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

  fields() {
    return this.props.book ? [
      {
        name: "Publisher",
        value: this.props.book.publisher
      },
      {
        name: "Published",
        "value": this.props.book.published
      },
      {
        name: "Categories",
        value: this.props.book.categories ?
                 this.props.book.categories.join(", ") :
                 null
      }
    ] : [];
  }

  circulationLinks() {
    let links = [];

    if (this.isOpenAccess()) {
      if (this.props.epubReaderUrlTemplate) {
        for (const link of this.props.book.openAccessLinks) {
          if (link.type === "application/epub+zip") {
            links.push(
              <span>
                <a
                  className="btn btn-default read-button"
                  href={this.props.epubReaderUrlTemplate(link.url)}
                  target="_blank"
                  >Read
                </a>
              </span>
            );
          }
        }
      }

      links.push(
        this.props.book.openAccessLinks.map(link => {
          return (
            <DownloadButton
              key={link.url}
              url={link.url}
              mimeType={link.type}
              isPlainLink={true}
              />
            );
        })
      );
    } else if (this.isBorrowed()) {
      links.push(
        this.props.book.fulfillmentLinks.map(link => {
          let isStreaming = link.type === "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";
          return (
            <DownloadButton
              key={link.url}
              fulfill={this.props.fulfillBook}
              indirectFulfill={this.props.indirectFulfillBook}
              url={link.url}
              mimeType={link.type}
              title={this.props.book.title}
              isPlainLink={isStreaming || !this.props.isSignedIn}
              indirectType={link.indirectType}
              />
          );
        })
      );
    }

    if (this.isReserved()) {
      links.push(
        <button key="onhold" className="btn btn-default disabled">Reserved</button>
      );
    } else if (this.props.book.borrowUrl) {
      let label = this.props.book.copies &&
                  this.props.book.copies.available === 0 ?
                  "Reserve" :
                  "Get";
      links.push(
        <BorrowButton
          key={this.props.book.borrowUrl}
          borrow={this.borrow}>
          { label }
        </BorrowButton>
      );
    }

    return links;
  }

  circulationInfo() {
    if (this.isOpenAccess()) {
      return [(
        <div key="oa" className="open-access-info">This open-access book is available to keep.</div>
      )];
    }

    if (this.isBorrowed()) {
      let availableUntil = this.props.book.availability && this.props.book.availability.until;
      if (availableUntil) {
        let timeLeft = moment(availableUntil).fromNow(true);
        return [(
          <div key="loan" className="loan-info">You have this book on loan for { timeLeft }.</div>
        )];
      }
      return [];
    }

    let info = [];

    let availableCopies = (this.props.book.copies && this.props.book.copies.available);
    let totalCopies = (this.props.book.copies && this.props.book.copies.total);
    let totalHolds = (this.props.book.holds && this.props.book.holds.total);
    let holdsPosition = (this.props.book.holds && this.props.book.holds.position);

    if (availableCopies !== undefined && availableCopies !== null
          && totalCopies !== undefined && totalCopies !== null) {
      info.push(
        <div key="copies" className="copies-info">
          { availableCopies } of { totalCopies } copies available
        </div>
      );
    }

    if (totalHolds && availableCopies === 0) {
      info.push(
        <div key="holds" className="holds-info">
          { totalHolds } patrons in hold queue
        </div>
      );
      if (this.isReserved() && holdsPosition !== undefined && holdsPosition !== null) {
        info.push(
          <div key="holds-position" className="holds-info">
            Your holds position: { holdsPosition }
          </div>
        );
      }
    }

    return info;
  }

  borrow(): Promise<BookData> {
    return this.props.updateBook(this.props.book.borrowUrl);
  }

  isReserved() {
    return this.props.book.availability &&
           this.props.book.availability.status === "reserved";
  }

  isBorrowed() {
    return this.props.book.fulfillmentLinks &&
           this.props.book.fulfillmentLinks.length > 0;
  }

  isOpenAccess() {
    return this.props.book.openAccessLinks &&
           this.props.book.openAccessLinks.length > 0;
  }

  rightColumnLinks() {
  }
}