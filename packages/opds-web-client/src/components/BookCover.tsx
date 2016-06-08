import * as React from "react";

export interface BookCoverProps {
  style?: any;
  text: string;
}

export default class BookCover extends React.Component<BookCoverProps, any> {
  render() {
    let cellStyle = Object.assign({
      display: "table-cell",
      verticalAlign: "middle",
      backgroundColor: "#eee",
      padding: "5px"
    }, this.props.style);

    // calculate font size
    // decrease size as max word length increases
    // decrease size as word count grows beyond 3
    // but minimum size is 15 regardless
    let words = this.props.text.split(" ");
    let wordCount = words.length;
    let maxLength = Math.max(...words.map(word => word.length));
    let fontSize = Math.max(15, 45 - maxLength * 2 - Math.max(0, wordCount - 3) * 2);

    let contentStyle = {
      color: "#888",
      fontSize: fontSize + "px",
      fontWeight: "bold",
      textAlign: "center"
    };

    // text is split so that "More" always appears on its own line
    return (
      <div className="bookCover" style={cellStyle}>
        <div style={contentStyle}>
          {this.props.text.split(" ")[0]}
          <br />
          {this.props.text.split(" ").slice(1).join(" ")}
        </div>
      </div>
    );
  }
}