import * as React from "react";
import { debounce } from "throttle-debounce";
import Book from "./Book";
import CatalogLink from "./CatalogLink";
import { Lanes } from "./Lanes";
import FacetGroup from "./FacetGroup";
import SkipNavigationLink from "./SkipNavigationLink";
import { CollectionData, FetchErrorData, BookData } from "../interfaces";

export interface CollectionProps extends React.HTMLProps<Collection> {
  collection: CollectionData;
  isFetchingCollection?: boolean;
  isFetchingBook?: boolean;
  isFetchingPage?: boolean;
  error?: FetchErrorData;
  fetchPage?: (url: string) => Promise<any>;
  updateBook: (url: string) => Promise<BookData>;
  fulfillBook: (url: string) => Promise<Blob>;
  indirectFulfillBook: (url: string, type: string) => Promise<string>;
  isSignedIn?: boolean;
  epubReaderUrlTemplate?: (epubUrl: string) => string;
  preferences?: {
    [key: string]: string;
  };
  setPreference: (key: string, value: string) => void;
}

/** Displays books in an OPDS collection as either lanes, a grid or a list. */
export default class Collection extends React.Component<CollectionProps, {}> {
  static VIEW_KEY = "collection-view";
  static GRID_VIEW = "grid-view";
  static LIST_VIEW = "list-view";

  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this);
    this.handleScrollOrResize = debounce(
      50,
      this.handleScrollOrResize.bind(this)
    );
    this.getSelectedView = this.getSelectedView.bind(this);
    this.selectGridView = this.selectGridView.bind(this);
    this.selectListView = this.selectListView.bind(this);
  }

  render(): JSX.Element {
    const hasFacets =
      this.props.collection.facetGroups &&
      this.props.collection.facetGroups.length > 0;
    const hasViews =
      this.props.collection.books && this.props.collection.books.length > 0;

    return (
      <div className="collection">
        {hasFacets && (
          <div className="facet-groups" aria-label="filters">
            <SkipNavigationLink target="#collection-main" label="filters" />
            {this.props.collection.facetGroups?.map(facetGroup => (
              <FacetGroup key={facetGroup.label} facetGroup={facetGroup} />
            ))}
          </div>
        )}

        <div className="collection-container">
          {hasViews && (
            <div className="view-toggle">
              <button
                title="Select grid view"
                disabled={this.getSelectedView() === Collection.GRID_VIEW}
                onClick={this.selectGridView}
              >
                <i className="fa fa-th-large"></i>
              </button>
              <button
                title="Select list view"
                disabled={this.getSelectedView() === Collection.LIST_VIEW}
                onClick={this.selectListView}
              >
                <i className="fa fa-th-list"></i>
              </button>
            </div>
          )}

          <div
            id="collection-main"
            className="collection-main"
            ref="collection-main"
            aria-label={"books in " + this.props.collection.title}
          >
            {this.props.collection.lanes &&
            this.props.collection.lanes.length > 0 ? (
              <Lanes
                url={this.props.collection.url}
                lanes={this.props.collection.lanes}
                updateBook={this.props.updateBook}
                isSignedIn={this.props.isSignedIn}
                epubReaderUrlTemplate={this.props.epubReaderUrlTemplate}
              />
            ) : null}

            {this.props.collection.books && (
              <ul
                aria-label="books"
                className={"subtle-list books " + this.getSelectedView()}
              >
                {this.props.collection.books.map((book, index) => (
                  <li key={index}>
                    <Book
                      book={book}
                      collectionUrl={this.props.collection.url}
                      updateBook={this.props.updateBook}
                      isSignedIn={this.props.isSignedIn}
                      epubReaderUrlTemplate={this.props.epubReaderUrlTemplate}
                    />
                  </li>
                ))}
              </ul>
            )}

            {this.props.collection.navigationLinks && (
              <nav role="navigation" aria-label="navigation links">
                <ul className="navigation-links subtle-list">
                  {this.props.collection.navigationLinks.map((link, index) => (
                    <li key={index}>
                      <CatalogLink collectionUrl={link.url}>
                        {link.text}
                      </CatalogLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {this.isEmpty() && (
              <div className="empty-collection-message">No books found.</div>
            )}

            {this.canFetch() && (
              <button
                className="next-page-link visually-hidden"
                onClick={this.fetch}
              >
                Load more books
              </button>
            )}

            {this.props.isFetchingPage && (
              <div className="loading-next-page">
                <h3>Loading more books...</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  getSelectedView(): string {
    return (
      (this.props.preferences && this.props.preferences[Collection.VIEW_KEY]) ||
      Collection.GRID_VIEW
    );
  }

  selectGridView() {
    if (this.props.setPreference) {
      this.props.setPreference(Collection.VIEW_KEY, Collection.GRID_VIEW);
    }
  }

  selectListView() {
    if (this.props.setPreference) {
      this.props.setPreference(Collection.VIEW_KEY, Collection.LIST_VIEW);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.isFetchingCollection &&
      !nextProps.isFetchingCollection &&
      !nextProps.error
    ) {
      (this.refs["collection-main"] as HTMLElement).scrollTop = 0;
    }

    // the component might be loading a new collection that doesn't fill the page
    this.handleScrollOrResize();
  }

  componentDidMount() {
    let body = this.refs["collection-main"] as HTMLElement;
    body.addEventListener("scroll", this.handleScrollOrResize);
    window.addEventListener("resize", this.handleScrollOrResize);

    // the first page might not fill the screen on initial load, so run handler once
    this.handleScrollOrResize();
  }

  componentWillUnmount() {
    let body = this.refs["collection-main"] as HTMLElement;
    body.removeEventListener("scroll", this.handleScrollOrResize);
    window.removeEventListener("resize", this.handleScrollOrResize);
  }

  canFetch() {
    return (
      !this.props.hidden &&
      !this.props.isFetchingPage &&
      !!this.props.collection.nextPageUrl
    );
  }

  fetch() {
    // had to move this typeguard into here for typescript to
    // believe the nextPageUrl was defined.
    if (this.canFetch() && this.props.collection.nextPageUrl) {
      this.props.fetchPage?.(this.props.collection.nextPageUrl);
    }
  }

  handleScrollOrResize() {
    let main = this.refs["collection-main"] as HTMLElement;
    if (main) {
      let scrollTop = main.scrollTop;
      let scrollHeight = main.scrollHeight;
      let clientHeight = main.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight) {
        this.fetch();
      }
    }
  }

  isEmpty() {
    return (
      this.props.collection.lanes.length === 0 &&
      this.props.collection.books.length === 0 &&
      this.props.collection.navigationLinks.length === 0
    );
  }
}
