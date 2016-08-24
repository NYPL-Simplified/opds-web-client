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
}

export default class BookDetails<P extends BookDetailsProps> extends React.Component<P, any> {
  constructor(props) {
    super(props);
    this.borrow = this.borrow.bind(this);
  }

  render(): JSX.Element {
    let bookSummaryStyle = {
      paddingTop: "2em",
      borderTop: "1px solid #ccc"
    };

    let fields = this.fields();

    return (
      <div className="bookDetails">
        <div className="bookDetailsTop" style={{ textAlign: "left", display: "table-row" }}>
          <div className="bookImage" style={{ display: "table-cell", paddingRight: "20px", verticalAlign: "top" }}>
            <BookCover book={this.props.book} />
          </div>
          <div className="bookDetailsHeader" style={{ display: "table-cell", verticalAlign: "top", textAlign: "left", maxWidth: "500px" }}>
            <h1 className="bookDetailsTitle" style={{ margin: 0 }}>{this.props.book.title}</h1>
            {
              this.props.book.series && this.props.book.series.name ?
              <h3 className="bookDetailsSeries" style={{ marginTop: "0.5em", fontSize: "1em" }}>{ this.props.book.series.name }</h3> :
              ""
            }
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
              { this.fields().map(field =>
                field.value ? <div className={"bookDetails-" + field.name.replace(" ", "-")} key={field.name}>{field.name}: {field.value}</div> : null
              ) }
            </div>
          </div>
        </div>
        <div style={{ clear: "both", marginTop: "1em" }}></div>
        <div
          style={bookSummaryStyle}>
          <div className="row">
            <div className="col-sm-3">
              { this.props.book.url &&
                <CatalogLink
                  className="btn btn-link"
                  target="_blank"
                  bookUrl={this.props.book.url}>
                  Permalink
                </CatalogLink>
              }
            </div>
            <div className="col-sm-6" style={{textAlign: "center", marginBottom: "30px"}}>
              <div style={{ marginBottom: "5px" }}>
                { this.circulationLinks() }
              </div>
              <div className="circulationInfo">
                { this.circulationInfo() }
              </div>
            </div>
            <div className="col-sm-3" style={{ textAlign: "right" }}>
              { this.rightColumnLinks() }
            </div>
          </div>

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
      links.push(
        this.props.book.openAccessLinks.map(link => {
          return (
            <DownloadButton
              key={link.url}
              style={{ marginRight: "0.5em" }}
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
              style={{ marginRight: "0.5em" }}
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
        <button key="onhold" className="btn btn-default disabled">On Hold</button>
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

  circulationInfo() {
    if (this.isOpenAccess()) {
      return [(
        <div key="oa">This open-access book is available to keep.</div>
      )];
    }

    if (this.isBorrowed()) {
      let availableUntil = this.props.book.availability && this.props.book.availability.until;
      if (availableUntil) {
        let timeLeft = moment(availableUntil).fromNow(true);
        return [(
          <div key="loan">You have this book on loan for { timeLeft }.</div>
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
        <div key="copies">
          { availableCopies } of { totalCopies } copies available
        </div>
      );
    }

    if (totalHolds && availableCopies === 0) {
      info.push(
        <div key="holds">
          { totalHolds } patrons in hold queue
        </div>
      );
      if (this.isReserved() && holdsPosition !== undefined && holdsPosition !== null) {
        info.push(
          <div key="holds-position">
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