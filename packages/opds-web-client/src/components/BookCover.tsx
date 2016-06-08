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
      textAlign: "center",
      padding: "5px"
    }, this.props.style);

    // calculate font size
    // decrease size as max word length increases
    // decrease size as word count grows beyond 3
    // but minimum size is 15 regardless
    let words = this.props.text.split(/\s/);
    let wordCount = words.length;
    let maxLength = Math.max(...words.map(word => word.length));
    let baseFontSize = parseInt((this.props.style || {}).fontSize || "45px");
    let fontSize = Math.max(15, baseFontSize - maxLength * 2 - Math.max(0, wordCount - 3) * 2);

    let contentStyle = {
      color: "#888",
      fontSize: fontSize + "px",
      fontWeight: "bold"
    };

    let parts = this.props.text.replace("\n", "`\n`").split("`").map((part, i) => {
      if (part === "\n") {
        return <br key={i} />;
      } else {
        return <span key={i}>{part}</span>;
      }
    })

    // text is split so that "More" always appears on its own line
    return (
      <div className="bookCover" style={cellStyle}>
        <div style={contentStyle}>
          { parts }
        </div>
      </div>
    );
  }
}