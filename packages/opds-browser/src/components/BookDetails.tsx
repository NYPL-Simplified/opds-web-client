import * as React from "react";

export default class BookDetails extends React.Component<BookProps, any> {
  render(): JSX.Element {
    let bookSummaryStyle = {
      paddingTop: "2em",
      borderTop: "1px solid #ccc"
    };

    return (
      <div className="bookDetails">
        <div className="bookDetailsTop" style={{ textAlign: "left", display: "table-row" }}>
          { this.props.book.imageUrl &&
            <div className="bookImage" style={{ display: "table-cell", paddingRight: "20px", verticalAlign: "top" }}>
              <img src={this.props.book.imageUrl} style={{ height: "150px" }}/>
            </div>
          }
          <div className="bookDetailsHeader" style={{ display: "table-cell", verticalAlign: "top", textAlign: "left", maxWidth: "500px" }}>
            <h1 className="bookDetailsTitle" style={{ margin: 0 }}>{this.props.book.title}</h1>
            {
              this.props.book.authors && this.props.book.authors.length ?
              <h2 className="bookDetailsAuthors" style={{ marginTop: "0.5em", fontSize: "1.2em" }}>{this.props.book.authors.join(", ")}</h2> :
              ""
            }
            {
              this.props.book.contributors && this.props.book.contributors.length ?
              <h2 className="bookDetailsContributors" style={{ marginTop: "0.5em", fontSize: "1.2em" }}>Contributors: {this.props.book.contributors.join(", ")}</h2> :
              ""
            }
            <div style={{ marginTop: "2em", color: "#888", fontSize: "0.9em" }}>
              { this.props.book.published &&
                <div className="bookDetailsPublished">Published: {this.props.book.published}</div>
              }
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
        <div style={{ clear: "both", marginTop: "1em" }}></div>
        <div
          className="bookDetailsSummary"
          style={bookSummaryStyle}
          dangerouslySetInnerHTML={{ __html: this.props.book.summary }}></div>
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
}