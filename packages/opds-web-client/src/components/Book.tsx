import * as React from "react";
import CatalogLink from "./CatalogLink";
import BookCover from "./BookCover";
import BorrowButton from "./BorrowButton";
import DownloadButton from "./DownloadButton";
import { BookData, FulfillmentLink, BookMedium } from "../interfaces";
import {
  bookIsBorrowed,
  bookIsReserved,
  bookIsReady,
  bookIsOpenAccess,
  getMedium,
  getMediumSVG
} from "../utils/book";

export interface BookProps {
  book: BookData;
  collectionUrl?: string;
  updateBook: (url: string | undefined) => Promise<BookData>;
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
    const bookMedium = getMedium(book);
    const showMediaIconClass = bookMedium ? "show-media" : "";
    const hasAuthors = !!(book.authors && book.authors.length);
    const hasContributors = !!(book.contributors && book.contributors.length);
    const contributors =
      book.contributors && book.contributors.length
        ? book.contributors.join(", ")
        : "";
    // Display contributors only if there are no authors.
    const authors = hasAuthors ? book.authors?.join(", ") : contributors;

    return (
      <div className={`book ${showMediaIconClass}`} lang={book.language}>
        <CatalogLink
          collectionUrl={this.props.collectionUrl}
          bookUrl={book.url || book.id}
          title={book.title}
        >
          <BookCover book={book} />
          <div className={`compact-info ${showMediaIconClass}`}>
            {getMediumSVG(bookMedium, false)}
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
              {bookMedium && <span>{getMediumSVG(bookMedium)}</span>}
              {this.fields().map((field, key) =>
                field.value ? (
                  <div
                    className={field.name.toLowerCase().replace(" ", "-")}
                    key={`${field.name}-${key}`}
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

    let links: JSX.Element[] = [];

    if (bookIsOpenAccess(this.props.book)) {
      if (this.props.epubReaderUrlTemplate) {
        let index = 0;
        for (const link of this.props.book.openAccessLinks ?? []) {
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

      this.props.book.openAccessLinks?.forEach((link, index) => {
        links.push(
          <DownloadButton
            key={`${link.url}-${index}`}
            isPlainLink={true}
            link={link}
            title={this.props.book.title}
          />
        );
      });
    } else if (bookIsBorrowed(this.props.book)) {
      // Put streaming links first, followed by a disabled "Borrowed" button that will
      // display in the list view if streaming is not available.

      let streamingMediaType =
        "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";
      let streamingLinks: FulfillmentLink[] = [];
      let downloadLinks: FulfillmentLink[] = [];
      for (let link of this.props.book.fulfillmentLinks ?? []) {
        if (
          link.type === streamingMediaType ||
          link.indirectType === streamingMediaType
        ) {
          streamingLinks.push(link);
        } else {
          downloadLinks.push(link);
        }
      }

      streamingLinks.forEach((link, index) => {
        let isDirectStreaming = link.type === streamingMediaType;
        links.push(
          <DownloadButton
            key={`${link.url}-${index}`}
            link={link}
            title={this.props.book.title}
            isPlainLink={isDirectStreaming || !this.props.isSignedIn}
          />
        );
      });

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
      downloadLinks.forEach((link, index) => {
        links.push(
          <DownloadButton
            key={`${link.url}-${index}`}
            link={link}
            title={this.props.book.title}
            isPlainLink={!this.props.isSignedIn}
          />
        );
      });
    }

    if (bookIsReserved(this.props.book)) {
      links.push(
        <button key="onhold" className="btn btn-default disabled">
          Reserved
        </button>
      );
    } else if (!bookIsBorrowed(this.props.book) && this.props.book.borrowUrl) {
      let label =
        !bookIsReady(this.props.book) &&
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

  borrow(): Promise<BookData> {
    return this.props.updateBook(this.props.book.borrowUrl);
  }
}
