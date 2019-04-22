import * as React from "react";
import * as moment from "moment";
import BookCover from "./BookCover";
import Book, { BookProps } from "./Book";

export interface BookDetailsProps extends BookProps {};

/** Detail page for a single book. */
export default class BookDetails<P extends BookDetailsProps> extends Book<P> {
  render(): JSX.Element {
    let fields = this.fields();
    const medium = this.getMedium(this.props.book);

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
              <h2 className="authors">By {this.props.book.authors.join(", ")}</h2> :
              ""
            }
            {
              this.props.book.contributors && this.props.book.contributors.length ?
              <h2 className="contributors">Contributors: {this.props.book.contributors.join(", ")}</h2> :
              ""
            }
            <div className="fields" lang="en">
              { fields.map(field =>
                field.value ? <div className={field.name.toLowerCase().replace(" ", "-")} key={field.name}>{field.name}: {field.value}</div> : null
              ) }
            </div>
            {
              medium && (
                <div className="item-icon-container">{this.getMediumSVG(medium)}</div>
              )
            }
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

  /**
   * rightColumnLinks
   * Not used in this app but can be overridden to add links on the
   * right column, such as adding links to report a problem.
   */
  rightColumnLinks(): any {}
}
