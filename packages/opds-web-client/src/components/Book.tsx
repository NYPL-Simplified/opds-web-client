import * as React from "react";
import CatalogLink from "./CatalogLink";
import BookCover from "./BookCover";
import BorrowButton from "./BorrowButton";
import DownloadButton from "./DownloadButton";
import { BookData } from "../interfaces";
import { AudioHeadphoneIcon, BookIcon } from "@nypl/dgx-svg-icons";
const download = require("downloadjs");

export interface BookProps {
  book: BookData;
  collectionUrl?: string;
  updateBook: (url: string) => Promise<BookData>;
  fulfillBook: (url: string) => Promise<Blob>;
  indirectFulfillBook: (url: string, type: string) => Promise<string>;
  isSignedIn?: boolean;
  epubReaderUrlTemplate?: (epubUrl: string) => string;
}

/** Displays a single book for use in a lane, list, or grid view. */
export default class Book<P extends BookProps> extends React.Component<P, {}> {
  constructor(props) {
    super(props);
    this.borrow = this.borrow.bind(this);
  }

  render(): JSX.Element {
    const book = this.props.book;
    // Remove HTML tags from the summary to fit more information into a truncated view.
    // The summary may still contain HTML character entities and needs to be rendered as HTML.
    let summary =
      (book && book.summary && book.summary.replace(/<\/?[^>]+(>|$)/g, " ")) ||
      "";
    const bookMedium = this.getMedium(book);
    const showMediaIconClass = bookMedium ? "show-media" : "";
    const hasAuthors = !!(book.authors && book.authors.length);
    const hasContributors = !!(book.contributors && book.contributors.length);
    const contributors =
      book.contributors && book.contributors.length
        ? book.contributors.join(", ")
        : "";
    // Display contributors only if there are no authors.
    const authors = hasAuthors ? book.authors.join(", ") : contributors;

    return (
      <div className={`book ${showMediaIconClass}`} lang={book.language}>
        <CatalogLink
          collectionUrl={this.props.collectionUrl}
          bookUrl={book.url || book.id}
          title={book.title}
        >
          <BookCover book={book} />
          <div className={`compact-info ${showMediaIconClass}`}>
            {this.getMediumSVG(bookMedium, false)}
            <div className="empty"></div>
            <div className="item-details">
              <div className="title">{book.title}</div>
              {book.series && book.series.name && (
                <div className="series">{book.series.name}</div>
              )}
              {(hasAuthors || hasContributors) && (
                <div className="authors">
                  <span>By {authors}</span>
                </div>
              )}
            </div>
          </div>
        </CatalogLink>
        <div className="expanded-info">
          <div className="header">
            <div>
              <CatalogLink
                collectionUrl={this.props.collectionUrl}
                bookUrl={book.url || book.id}
                title={book.title}
              >
                <div className="title">{book.title}</div>
              </CatalogLink>
              {book.series && book.series.name && (
                <div className="series">{book.series.name}</div>
              )}
              {(hasAuthors || hasContributors) && (
                <div className="authors">
                  <span>By {authors}</span>
                </div>
              )}
            </div>
            <div className="circulation-links">{this.circulationLinks()}</div>
          </div>
          <div className="details">
            <div className="fields" lang="en">
              {bookMedium && <span>{this.getMediumSVG(bookMedium)}</span>}
              {this.fields().map((field, key) =>
                field.value ? (
                  <div
                    className={field.name.toLowerCase().replace(" ", "-")}
                    key={`${field.name}`}
                  >
                    {field.name}: {field.value}
                  </div>
                ) : null
              )}
            </div>
            <div className="summary" lang={book.language}>
              <span dangerouslySetInnerHTML={{ __html: summary }}></span>
              <CatalogLink
                collectionUrl={this.props.collectionUrl}
                bookUrl={book.url || book.id}
                title={book.title}
              >
                &hellip; More
              </CatalogLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  fields() {
    return this.props.book
      ? [
          {
            name: "Publisher",
            value: this.props.book.publisher
          },
          {
            name: "Published",
            value: this.props.book.published
          },
          {
            name: "Categories",
            value: this.props.book.categories
              ? this.props.book.categories.join(", ")
              : null
          }
        ]
      : [];
  }

  circulationLinks() {
    // Links are ordered so that the first link should be the most useful.
    // That way compact views can display only the first link.

    let links = [];

    if (this.isOpenAccess()) {
      if (this.props.epubReaderUrlTemplate) {
        let index = 0;
        for (const link of this.props.book.openAccessLinks) {
          if (link.type === "application/epub+zip") {
            links.push(
              <span key={`${link.url}-${index}`}>
                <a
                  className="btn btn-default read-button"
                  href={this.props.epubReaderUrlTemplate(link.url)}
                  target="_blank"
                >
                  Read Online
                </a>
              </span>
            );
            index++;
          }
        }
      }

      links.push(
        this.props.book.openAccessLinks.map((link, index) => {
          return (
            <DownloadButton
              key={`${link.url}-${index}`}
              url={link.url}
              mimeType={link.type}
              isPlainLink={true}
            />
          );
        })
      );
    } else if (this.isBorrowed()) {
      // Put streaming links first, followed by a disabled "Borrowed" button that will
      // display in the list view if streaming is not available.

      let streamingMediaType =
        "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";
      let streamingLinks = [];
      let downloadLinks = [];
      for (let link of this.props.book.fulfillmentLinks) {
        if (
          link.type === streamingMediaType ||
          link.indirectType === streamingMediaType
        ) {
          streamingLinks.push(link);
        } else {
          downloadLinks.push(link);
        }
      }

      links.push(
        streamingLinks.map((link, index) => {
          let isDirectStreaming = link.type === streamingMediaType;
          return (
            <DownloadButton
              key={`${link.url}-${index}`}
              fulfill={this.props.fulfillBook}
              indirectFulfill={this.props.indirectFulfillBook}
              url={link.url}
              mimeType={link.type}
              title={this.props.book.title}
              isPlainLink={isDirectStreaming || !this.props.isSignedIn}
              indirectType={link.indirectType}
            />
          );
        })
      );
      links.push(
        <BorrowButton
          key={this.props.book.borrowUrl}
          className="btn btn-default borrowed-button"
          disabled={true}
          borrow={this.borrow}
        >
          Borrowed
        </BorrowButton>
      );
      links.push(
        downloadLinks.map((link, index) => {
          return (
            <DownloadButton
              key={`${link.url}-${index}`}
              fulfill={this.props.fulfillBook}
              indirectFulfill={this.props.indirectFulfillBook}
              url={link.url}
              mimeType={link.type}
              title={this.props.book.title}
              isPlainLink={!this.props.isSignedIn}
              indirectType={link.indirectType}
            />
          );
        })
      );
    }

    if (this.isReserved()) {
      links.push(
        <button key="onhold" className="btn btn-default disabled">
          Reserved
        </button>
      );
    } else if (!this.isBorrowed() && this.props.book.borrowUrl) {
      let label =
        !this.isReady() &&
        this.props.book.copies &&
        this.props.book.copies.available === 0
          ? "Reserve"
          : "Borrow";
      links.push(
        <BorrowButton key={this.props.book.borrowUrl} borrow={this.borrow}>
          {label}
        </BorrowButton>
      );
    }

    return links;
  }

  getMedium(book) {
    if (
      !book.raw ||
      !book.raw["$"] ||
      !book.raw["$"]["schema:additionalType"]
    ) {
      return "";
    }

    return book.raw["$"]["schema:additionalType"].value
      ? book.raw["$"]["schema:additionalType"].value
      : "";
  }

  getMediumSVG(medium, displayLabel = true) {
    if (!medium) {
      return null;
    }

    const svgMediumTypes = {
      "http://bib.schema.org/Audiobook": {
        element: <AudioHeadphoneIcon ariaHidden title="Audio/Headphone Icon" />,
        label: "Audio"
      },
      "http://schema.org/EBook": {
        element: <BookIcon ariaHidden title="eBook Icon" />,
        label: "eBook"
      },
      "http://schema.org/Book": {
        element: <BookIcon ariaHidden title="eBook Icon" />,
        label: "eBook"
      }
    };
    const svgElm = svgMediumTypes[medium];

    return svgElm ? (
      <div className="item-icon">
        {svgElm.element} {displayLabel ? svgElm.label : null}
      </div>
    ) : null;
  }

  borrow(): Promise<BookData> {
    return this.props.updateBook(this.props.book.borrowUrl);
  }

  isReserved() {
    return (
      this.props.book.availability &&
      this.props.book.availability.status === "reserved"
    );
  }

  isReady() {
    return (
      this.props.book.availability &&
      this.props.book.availability.status === "ready"
    );
  }

  isBorrowed() {
    return (
      this.props.book.fulfillmentLinks &&
      this.props.book.fulfillmentLinks.length > 0
    );
  }

  isOpenAccess() {
    return (
      this.props.book.openAccessLinks &&
      this.props.book.openAccessLinks.length > 0
    );
  }
}
