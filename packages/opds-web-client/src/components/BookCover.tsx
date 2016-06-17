import * as React from "react";
import * as ReactDOM from "react-dom";
import { BookData } from "../interfaces";
const seedrandom = require("seedrandom");

export interface BookCoverProps extends React.HTMLProps<BookCover> {
  book: BookData;
}

export default class BookCover extends React.Component<BookCoverProps, any> {
  render() {
    let { title, authors } = this.props.book;

    let titleStyle = Object.assign({
      display: "table-cell",
      height: "120px",
      width: "150px",
      verticalAlign: "bottom",
      color: "#444",
      backgroundColor: "#eee",
      fontWeight: "normal",
      padding: "10px",
    }, this.computeFontStyle(title, 40));

    let authorStyle = Object.assign({
      paddingTop: "10px",
      color: "#fff",
      padding: "10px"
    }, this.computeFontStyle(authors.join(", "), 25));

    let hue = this.seededRandomHue(title);
    let bgColor = `hsla(${hue}, 40%, 60%, 1)`;
    let cellStyle = {
      float: "left",
      width: "150px",
      height: "200px",
      backgroundColor: bgColor,
      border: "1px solid #888",
      fontWeight: "normal",
      fontFamily: "Georgia, serif",
      position: "relative",
      textAlign: "left"
    };

    return (
      <div className="autoBookCover" style={cellStyle}>
        <div style={titleStyle}>{ title }</div>
        <div style={authorStyle}>{ authors.join(", ") }</div>
      </div>
    );
  }

  computeFontStyle(text, baseFontSize = 40, minFontSize = 15) {
    // decrease size as max word length increases
    // decrease size as word count grows beyond 3
    let words = text.split(/\s/);
    let wordCount = words.length;
    let maxLength = Math.max(...words.map(word => word.length));
    let fontSize = Math.max(minFontSize, baseFontSize - maxLength * 2 - Math.max(0, wordCount - 3) * 2);
    let lineHeight = fontSize + 5;

    return {
      fontSize: fontSize + "px",
      lineHeight: "1em"
    };
  }

  seededRandomHue(seed) {
    return Math.round(360 * seedrandom(seed)());
  }
}