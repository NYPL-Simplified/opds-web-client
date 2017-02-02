import * as React from "react";
import { debounce } from "throttle-debounce";
import Book from "./Book";
import CatalogLink from "./CatalogLink";
import { Lanes } from "./Lanes";
import FacetGroup from "./FacetGroup";
import Search from "./Search";
import SkipNavigationLink from "./SkipNavigationLink";
import { CollectionData, LinkData, FetchErrorData } from "../interfaces";

export interface CollectionProps extends React.HTMLProps<Collection> {
  collection: CollectionData;
  isFetching?: boolean;
  isFetchingPage?: boolean;
  error?: FetchErrorData;
  fetchPage?: (url: string) => Promise<any>;
}

export default class Collection extends React.Component<CollectionProps, any> {
  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this);
    this.handleScrollOrResize = debounce(50, this.handleScrollOrResize.bind(this));
  }

  render(): JSX.Element {
    let hasFacets = (this.props.collection.facetGroups && this.props.collection.facetGroups.length > 0);

    return (
      <div className="collection">
        { hasFacets && (
          <div className="facet-groups" role="complementary" aria-label="filters">
            <SkipNavigationLink target="#collection-main" label="filters"/>
            { this.props.collection.facetGroups.map(facetGroup =>
                <FacetGroup
                  key={facetGroup.label}
                  facetGroup={facetGroup}
                  />
            ) }
          </div>
        )}

        <div
          id="collection-main"
          className="collection-main"
          ref="collection-main"
          aria-label={"books in " + this.props.collection.title}>
          { (this.props.collection.lanes && this.props.collection.lanes.length > 0) ?
            <Lanes
              url={this.props.collection.url}
              lanes={this.props.collection.lanes}
              /> : null
          }

          { this.props.collection.books &&
            <ul aria-label="books" className="subtle-list books">
            { this.props.collection.books.map((book, index) =>
              <li key={index}>
                <Book
                  book={book}
                  collectionUrl={this.props.collection.url} />
              </li>
            ) }
            </ul>
          }

          { this.props.collection.navigationLinks &&
            <ul aria-label="navigation links" className="navigation-links subtle-list" role="navigation">
            { this.props.collection.navigationLinks.map((link, index) =>
              <li key={index}>
                <CatalogLink
                  collectionUrl={link.url}
                  >
                  {link.text}
                </CatalogLink>
              </li>) }
            </ul>
          }

          { this.isEmpty() &&
            <div className="empty-collection-message">
              No books found.
            </div>
          }

          { this.canFetch() &&
            <button
              className="next-page-link visually-hidden"
              onClick={this.fetch}>
              Load more books
            </button>
          }

          { this.props.isFetchingPage &&
            <div className="loading-next-page">
              <h3>Loading more books...</h3>
            </div>
          }
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isFetching && !nextProps.isFetching && !nextProps.error) {
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
    return !this.props.hidden && !this.props.isFetchingPage && this.props.collection.nextPageUrl;
  }

  fetch() {
    if (this.canFetch()) {
      this.props.fetchPage(this.props.collection.nextPageUrl);
    }
  }

  handleScrollOrResize() {
    let main = this.refs["collection-main"] as HTMLElement;
    let scrollTop = main.scrollTop;
    let scrollHeight = main.scrollHeight;
    let clientHeight = main.clientHeight;
    if ((scrollTop + clientHeight) >= scrollHeight) {
      this.fetch();
    }
  }

  isEmpty() {
    return this.props.collection.lanes.length === 0 &&
           this.props.collection.books.length === 0 &&
           this.props.collection.navigationLinks.length === 0;
  }
}