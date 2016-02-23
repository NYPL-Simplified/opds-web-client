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
    let headerHeight = 70;
    let navHeight = this.props.history && this.props.history.length ? 30 : 0;
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

    let navStyle = {
      height: `${navHeight}px`,
      position: "fixed",
      top: `${headerHeight + padding}px`,
      width: "100%",
      backgroundColor: "#fff",
      borderBottom: "1px solid #eee",
      paddingTop: `${padding}px`,
      paddingLeft: `${padding}px`
    };

    let collectionBodyStyle: any = {
      padding: `${padding}px`,
      paddingTop: `${headerHeight + navHeight + padding + padding}px`,
      height: "100%",
      marginTop: `${padding + 5}px`
    };

    if (this.props.collection.facetGroups && this.props.collection.facetGroups.length) {
      collectionBodyStyle.marginLeft = `${leftPanelWidth + padding}px`;
    }

    let leftPanelStyle = {
      marginTop: `${headerHeight + navHeight + padding}px`,
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
          { this.props.collection.search &&
            <div style={{ float: "right", marginRight: "20px" }}>
              <Search
                url={this.props.collection.search.url}
                searchData={this.props.collection.search.searchData}
                fetchSearchDescription={this.props.fetchSearchDescription}
                setCollection={this.props.setCollection} />
            </div>
          }
          <h1 className="collectionTitle">{this.props.collection.title}</h1>
        </div>

        { this.props.history && this.props.history.length > 0 &&
          <nav aria-label="breadcrumbs" role="navigation" style={ navStyle }>
            <ul style={subtleListStyle}>
              { this.props.history.map(breadcrumb =>
                <li style={{ listStyle: "none", float: "left", marginRight: "5px" }} key={breadcrumb.id}>
                  <CollectionLink
                    text={breadcrumb.text}
                    url={breadcrumb.url}
                    pathFor={this.props.pathFor}
                    setCollection={this.props.setCollection}
                    style={{ fontSize: "1.2em", marginRight: "5px", cursor: "pointer" }} />
                  ›
                </li>
              )}
              <li className="currentCollection" style={{ listStyle: "none", float: "left", fontSize: "1.2em" }}>
                {this.props.collection.title}
              </li>
            </ul>
          </nav>
        }

        { this.props.collection.facetGroups && this.props.collection.facetGroups.length > 0 && (
          <div className="facetGroups" style={leftPanelStyle} role="navigation" aria-label="filters">
            <SkipNavigationLink />
            { this.props.collection.facetGroups.map(facetGroup =>
                <FacetGroup
                  key={facetGroup.label}
                  facetGroup={facetGroup}
                  pathFor={this.props.pathFor}
                  setCollection={this.props.setCollection} />
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
                  setCollection={this.props.setCollection}
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
    return !this.props.isFetchingPage && this.props.collection.nextPageUrl;
  }

  fetch() {
    if (this.canFetch()) {
      this.props.fetchPage(this.props.collection.nextPageUrl);
    }
  }

  handleScrollOrResize() {
    if ((document.body.scrollTop + window.innerHeight) >= document.body.scrollHeight) {
      this.fetch();
    }
  }
}