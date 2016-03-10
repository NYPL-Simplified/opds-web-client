import * as React from "react";

export default class BookDetails extends React.Component<BookDetailsProps, any> {
  render(): JSX.Element {
    let bookSummaryStyle = {
      marginTop: "1em",
      paddingTop: "1em",
      borderTop: "1px solid #ccc"
    };

    let bookStyle = {
      padding: "40px",
      maxWidth: "700px",
      margin: "0 auto"
    };

    let wrapperStyle = {
      position: "fixed",
      width: "100%",
      top: `${this.props.marginTop}`,
      height: `calc(100% - ${this.props.marginTop}px)`,
      backgroundColor: "white",
      zIndex: 100,
      overflowY: "scroll"
    };

    console.log(wrapperStyle);

    let links = [
      {
        text: "Edit",
        url: (id) => "/admin/?app=editor&book=" + id
      }
    ];

    return (
      <div className="bookDetailsWrapper" style={wrapperStyle}>
        <div className="bookDetails" style={bookStyle}>
          <div className="bookDetailsTop" style={{ textAlign: "left", display: "table-row" }}>
            <div className="bookImage" style={{ display: "table-cell", paddingRight: "20px", verticalAlign: "top" }}>
              <img src={this.props.book.imageUrl} style={{ height: "150px" }}/>
            </div>
            <div className="bookDetailsHeader" style={{ display: "table-cell", verticalAlign: "top", textAlign: "left", maxWidth: "500px" }}>
              <h1 className="bookDetailsTitle" style={{ margin: 0 }}>{this.props.book.title}</h1>
              {
                this.props.book.authors.length ?
                <h2 className="bookDetailsAuthors" style={{ marginTop: "0.5em", fontSize: "1.2em" }}>{this.props.book.authors.join(", ")}</h2> :
                ""
              }
              {
                this.props.book.contributors && this.props.book.contributors.length ?
                <h2 className="bookDetailsContributors" style={{ marginTop: "0.5em", fontSize: "1.2em" }}>Contributors: {this.props.book.contributors.join(", ")}</h2> :
                ""
              }
              <div style={{ marginTop: "2em", color: "#888", fontSize: "0.9em" }}>
                <div className="bookDetailsPublished">Published: {this.props.book.published}</div>
                {
                  this.props.book.publisher ?
                  <div className="bookDetailsPublisher">Publisher: {this.props.book.publisher}</div> :
                  ""
                }
                {
                  this.props.book.categories && this.props.book.categories.length ?
                  <div className="bookDetailsCategories">Categories: {this.props.book.categories.join(", ")}</div> :
                  ""
                }
              </div>
            </div>
          </div>
          <div style={{ clear: "both" }}></div>
          <div
            className="bookDetailsSummary"
            style={bookSummaryStyle}
            dangerouslySetInnerHTML={{ __html: this.props.book.summary }}></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.setCollectionOverflow("hidden");
  }

  componentWillUnmount() {
    this.setCollectionOverflow("visible");
  }

  setCollectionOverflow(value: string) {
    let elem = document.getElementsByTagName("body")[0] as HTMLElement;

    if (elem) {
      elem.style.overflow = value;
    }
  }
}