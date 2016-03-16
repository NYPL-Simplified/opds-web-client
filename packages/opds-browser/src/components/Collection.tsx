import * as React from "react";
import Book from "./Book";
import CollectionLink from "./CollectionLink";
import Lane from "./Lane";
import FacetGroup from "./FacetGroup";
import Search from "./Search";
import SkipNavigationLink from "./SkipNavigationLink";
import { visuallyHiddenStyle, subtleListStyle } from "./styles";

export default class Collection extends React.Component<CollectionProps, any> {
  render(): JSX.Element {
    let leftPanelWidth = 190;
    let padding = 10;

    let collectionBodyStyle: any = {
      padding: `${padding}px`,
      height: "100%"
    };

    if (this.props.collection.facetGroups && this.props.collection.facetGroups.length) {
      collectionBodyStyle.marginLeft = `${leftPanelWidth + padding}px`;
    }

    let leftPanelStyle = {
      width: `${leftPanelWidth}px`,
      position: "fixed",
      left: "0"
    };

    let linkStyle = {
      textAlign: "center",
      backgroundColor: "#ddd",
      margin: "25px",
      padding: "10px",
      overflow: "hidden",
      fontSize: "500%",
      display: "block"
    };

    let loadingNextPageStyle = {
      clear: "both",
      height: "50px",
      textAlign: "center",
      padding: "10px"
    };

    return (
      <div className="collection">
        { this.props.collection.facetGroups && this.props.collection.facetGroups.length > 0 && (
          <div className="facetGroups" style={leftPanelStyle} role="navigation" aria-label="filters">
            <SkipNavigationLink />
            { this.props.collection.facetGroups.map(facetGroup =>
                <FacetGroup
                  key={facetGroup.label}
                  facetGroup={facetGroup}
                  pathFor={this.props.pathFor}
                  setCollectionAndBook={this.props.setCollectionAndBook} />
            ) }
          </div>
        )}

        <div
          className="collectionBody"
          style={collectionBodyStyle}
          role="main"
          aria-label={"books in " + this.props.collection.title}>
          <a className="mainAnchor" name="main"></a>

          { this.props.collection.lanes &&
            <ul aria-label="groups of books" style={subtleListStyle}>
            { this.props.collection.lanes.map(lane =>
              <li key={lane.title}>
                <Lane
                  lane={lane}
                  setCollectionAndBook={this.props.setCollectionAndBook}
                  setBook={this.props.setBook}
                  pathFor={this.props.pathFor}
                  collectionUrl={this.props.collection.url} />
              </li>
            ) }
            </ul>
          }

          { this.props.collection.books &&
            <ul aria-label="books" style={subtleListStyle}>
            { this.props.collection.books.map(book =>
              <li key={book.id}>
                <Book
                  book={book}
                  setBook={this.props.setBook}
                  pathFor={this.props.pathFor}
                  collectionUrl={this.props.collection.url} />
              </li>
            ) }
            </ul>
          }

          { this.props.collection.links &&
            <ul aria-label="navigation links" style={subtleListStyle} role="navigation">
            { this.props.collection.links.map(link =>
              <li key={link.id}>
                <CollectionLink
                  text={link.text}
                  url={link.url}
                  setCollectionAndBook={this.props.setCollectionAndBook}
                  pathFor={this.props.pathFor}
                  style={linkStyle} />
              </li>) }
            </ul>
          }

          { this.canFetch() &&
            <button
              className="nextPageLink"
              style={visuallyHiddenStyle}
              onClick={this.fetch.bind(this)}>
              Load more books
            </button>
          }

          { this.props.isFetchingPage &&
            <div className="loadingNextPage" style={loadingNextPageStyle}>
              <h3>Loading next page...</h3>
            </div>
          }
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isFetching && !nextProps.isFetching && !nextProps.error) {
       document.body.scrollTop = 0;
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
}