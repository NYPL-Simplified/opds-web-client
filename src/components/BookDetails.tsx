import * as React from "react";

export default class BookDetails extends React.Component<BookProps, any> {
  render(): JSX.Element {
    let bookDetailsStyle = {
      width: "80%",
      height: "50%",
      position: "fixed",
      left: "10%",
      top: "25%",
      overflowY: "scroll",
      padding: "30px",
      backgroundColor: "#fff",
      fontFamily: "Arial, Helvetica, sans-serif",
      zIndex: 20
    };

    let screenStyle = {
      position: "fixed",
      zIndex: 10,
      top: "0",
      bottom: "0",
      width: "100%",
      backgroundColor: "rgba(128, 128, 128, 0.8)"
    };

    return (
      <div>
        <div
          className="bookDetailsScreen"
          onClick={() => this.props.hideBookDetails()}
          style={screenStyle}></div>
        <div className="bookDetails" style={bookDetailsStyle}>
          <div style={{ float: "right" }}>
            <a href="javascript:void(0)"
              className="bookDetailsCloseLink"
              style={{ fontSize: "1em" }}
              onClick={this.props.hideBookDetails}>
              Close
            </a>
          </div>
          <div className="bookImage" style={{ width: "150px", float: "left", textAlign: "right" }}>
            <img src={this.props.imageUrl} style={{ height: "150px" }}/>
          </div>
          <div className="bookDetailsTop" style={{ marginLeft: "1em", float: "left" }}>
            <h1 className="bookDetailsTitle" style={{ margin: 0 }}>{this.props.title}</h1>
            {
              this.props.authors.length ?
              <h2 className="bookDetailsAuthors" style={{ marginTop: "0.5em", fontSize: "1.2em" }}>{this.props.authors.join(", ")}</h2> :
              ""
            }
            {
              this.props.contributors && this.props.contributors.length ?
              <h2 className="bookDetailsContributors" style={{ marginTop: "0.5em", fontSize: "1.2em" }}>Contributors: {this.props.contributors.join(", ")}</h2> :
              ""
            }
            <div style={{ marginTop: "2em", color: "#888", fontSize: "0.9em" }}>
              <div className="bookDetailsPublished">Published: {this.props.published}</div>
              {
                this.props.publisher ?
                <div className="bookDetailsPublisher">Publisher: {this.props.publisher}</div> :
                ""
              }
              {
                this.props.categories && this.props.categories.length ?
                <div className="bookDetailsCategories">Categories: {this.props.categories.join(", ")}</div> :
                ""
              }
            </div>
          </div>
          <div style={{ clear: "both" }}></div>
          <div
            className="bookDetailsSummary"
            style={{ marginTop: "1em", marginBottom: "1em", paddingTop: "1em", borderTop: "1px solid #ccc" }}
            dangerouslySetInnerHTML={{ __html: this.props.summary }}></div>
        </div>
      </div>
    );
  }
}