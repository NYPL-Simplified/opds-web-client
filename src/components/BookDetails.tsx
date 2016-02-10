import * as React from "react";

export default class BookDetails extends React.Component<BookProps, any> {
  render(): JSX.Element {
    let bookDetailsStyle = {
      position: "fixed",
      top: "50%",
      left: "50%",
      width: "800px",
      marginTop: "-100px",
      marginLeft: "-400px",
      padding: "30px",
      backgroundColor: "#fff",
      fontFamily: "Arial, Helvetica, sans-serif"
    };

    let imageStyle = {
      float: "left",
      height: "150px"
    };

    return (
      <div className="bookDetails" style={bookDetailsStyle}>
        <img src={this.props.imageUrl} style={imageStyle}/>
        <div className="bookDetailsTop" style={{ float: "left", marginLeft: "1em" }}>
          <h1 className="bookDetailsTitle" style={{ margin: 0 }}>{this.props.title}</h1>
          <div className="bookDetailsAuthor" style={{ marginTop: "0.5em" }}>{this.props.authors}</div>
          <br />
          Published: {this.props.published}<br />
          Publisher: {this.props.publisher}<br />
        </div>
        <div style={{ clear: "both" }}></div>
        <button
          className="bookDetailsCloseButton"
          onClick={() => this.props.hideBookDetails()}>
          Close
        </button>
      </div>
    );
  }
}