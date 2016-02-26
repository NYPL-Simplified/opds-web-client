import * as React from "react";

export default class BookDetails extends React.Component<BookProps, any> {
  render(): JSX.Element {
    let bookDetailsStyle = {
      width: "100%",
      height: "100%",
      overflowY: "auto"
    };

    return (
      <div style={bookDetailsStyle}>
        <div className="bookImage" style={{ width: "150px", float: "left", textAlign: "right" }}>
          <img src={this.props.book.imageUrl} style={{ height: "150px" }}/>
        </div>
        <div className="bookDetailsTop" style={{ marginLeft: "1em", float: "left" }}>
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
        <div style={{ clear: "both" }}></div>
        <div
          className="bookDetailsSummary"
          style={{ marginTop: "1em", marginBottom: "1em", paddingTop: "1em", borderTop: "1px solid #ccc" }}
          dangerouslySetInnerHTML={{ __html: this.props.book.summary }}></div>
      </div>
    );
  }
}