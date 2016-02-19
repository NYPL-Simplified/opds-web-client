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
    let padding = 10;
    let headerHeight = 50;
    let leftPanelWidth = 190;

    let collectionTopStyle = {
      padding: `${padding}px`,
      backgroundColor: "#eee",
      borderBottom: "1px solid #ccc",
      marginBottom: `${padding}px`,
      textAlign: "center",
      position: "fixed",
      width: "100%",
      height: `${headerHeight}px`,
      top: "0"
    };

    let collectionBodyStyle: any = {
      padding: `${padding}px`,
      paddingTop: `${headerHeight + padding}px`,
      height: "100%",
      marginTop: `${padding + 5}px`
    };

    if (this.props.collection.facetGroups && this.props.collection.facetGroups.length) {
      collectionBodyStyle.marginLeft = `${leftPanelWidth + padding}px`;
    }

    let leftPanelStyle = {
      paddingTop: `${headerHeight + padding}px`,
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
      textAlign: "center"
    };

    return (
      <div className="collection" style={{ fontFamily: "Arial, sans-serif" }}>
        <div
          className="collectionTop"
          style={collectionTopStyle}
          aria-label={this.props.collection.title + " header and search"}
          role="banner">
          <h1 style={{ margin: 0 }}>{this.props.collection.title}</h1>
          { this.props.collection.search &&
            <Search
              url={this.props.collection.search.url}
              searchData={this.props.collection.search.searchData}
              fetchSearchDescription={this.props.fetchSearchDescription}
              setCollection={this.props.setCollection} />
          }
        </div>

        { this.props.collection.facetGroups && this.props.collection.facetGroups.length > 0 && (
          <div className="facetGroups" style={leftPanelStyle} role="navigation" aria-label="filters">
            <SkipNavigationLink />
            { this.props.collection.facetGroups.map(facetGroup =>
                <FacetGroup key={facetGroup.label} facetGroup={facetGroup} setCollection={this.props.setCollection} />
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
                  setCollection={this.props.setCollection}
                  setBook={this.props.setBook}
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
                  setCollection={this.props.setCollection}
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
            <div className="loadingNextPage" style={loadingNextPageStyle}>Loading next page...</div>
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
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll.bind(this));
  }

  canFetch() {
    return !this.props.isFetchingPage && this.props.collection.nextPageUrl;
  }

  fetch() {
    if (this.canFetch()) {
      this.props.fetchPage(this.props.collection.nextPageUrl);
    }
  }

  handleScroll() {
    if ((document.body.scrollTop + window.innerHeight) >= document.body.scrollHeight) {
      this.fetch();
    }
  }
}