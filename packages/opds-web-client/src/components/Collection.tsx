import * as React from "react";
import "../stylesheets/collection.scss";
import "../stylesheets/subtle_list.scss";
import "../stylesheets/visually_hidden.scss";
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
  }

  render(): JSX.Element {
    let hasFacets = (this.props.collection.facetGroups && this.props.collection.facetGroups.length > 0);
    let bodyClass = hasFacets ? "body with-facets" : "body";

    return (
      <div className="collection">
        { hasFacets && (
          <div className="facet-groups" role="navigation" aria-label="filters">
            <SkipNavigationLink />
            { this.props.collection.facetGroups.map(facetGroup =>
                <FacetGroup
                  key={facetGroup.label}
                  facetGroup={facetGroup}
                  />
            ) }
          </div>
        )}

        <div
          className={bodyClass}
          role="main"
          aria-label={"books in " + this.props.collection.title}>
          <a className="main-anchor" name="main"></a>

          { (this.props.collection.lanes && this.props.collection.lanes.length > 0) ?
            <Lanes
              url={this.props.collection.url}
              lanes={this.props.collection.lanes}
              /> : null
          }

          { this.props.collection.books &&
            <ul aria-label="books" className="subtle-list">
            { this.props.collection.books.map(book =>
              <li key={book.id}>
                <Book
                  book={book}
                  collectionUrl={this.props.collection.url} />
              </li>
            ) }
            </ul>
          }

          { this.props.collection.navigationLinks &&
            <ul aria-label="navigation links" className="navigation-links subtle-list" role="navigation">
            { this.props.collection.navigationLinks.map(link =>
              <li key={link.id}>
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
              No books here.
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
       document.body.scrollTop = 0;
       document.documentElement.scrollTop = 0;
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScrollOrResize.bind(this));
    window.addEventListener("resize", this.handleScrollOrResize.bind(this));

    // the first page might not fill the screen on initial load, so run handler once
    this.handleScrollOrResize();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScrollOrResize.bind(this));
    window.removeEventListener("resize", this.handleScrollOrResize.bind(this));
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
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if ((scrollTop + window.innerHeight) >= document.body.scrollHeight) {
      this.fetch();
    }
  }

  isEmpty() {
    return this.props.collection.lanes.length === 0 &&
           this.props.collection.books.length === 0 &&
           this.props.collection.navigationLinks.length === 0;
  }
}