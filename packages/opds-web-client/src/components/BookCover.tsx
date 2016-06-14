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
    let titleStyle = Object.assign(this.computeFontStyle(title, 40), {
      display: "table-cell",
      height: "120px",
      width: "150px",
      verticalAlign: "bottom",
      color: "#444",
      backgroundColor: "#eee",
      fontWeight: "normal",
      padding: "10px",
    });
    let authorStyle = Object.assign(this.computeFontStyle(authors.join(", "), 25), {
      paddingTop: "10px",
      color: "#fff",
      padding: "10px"
    });

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

    let bindingStyle = {
      float: "left",
      width: "5px",
      backgroundColor: "#fff",
      height: "100%"
    }

    // text is split so that "More" always appears on its own line
    return (
      <div style={cellStyle}>
        <div style={titleStyle}>{ title }</div>
        <div style={authorStyle}>{ authors }</div>
      </div>
    );
  }

  computeFontStyle(text, baseFontSize = 40, minFontSize = 15) {
    // calculate font size
    // decrease size as max word length increases
    // decrease size as word count grows beyond 3
    // but minimum size is 15 regardless
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