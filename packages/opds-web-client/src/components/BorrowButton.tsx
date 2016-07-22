import * as React from "react";
import { BookData } from "../interfaces";
const download = require("downloadjs");

export interface BorrowButtonProps extends React.HTMLProps<any> {
  book: BookData;
  borrow: (url: string) => Promise<any>;
}

export default class BorrowButton extends React.Component<BorrowButtonProps, any> {
  constructor(props) {
    super(props);
    this.borrow = this.borrow.bind(this);
  }

  render() {
    let props = Object.assign({}, this.props);
    delete props["book"];
    delete props["borrow"];

    return (
      <button
        className="btn btn-default"
        {...props}
        onClick={this.borrow}>
        Borrow
      </button>
    );
  }

  borrow() {
    return this.props.borrow(this.props.book.borrowUrl).then(({ blob, mimeType }) => {
      return download(
        blob,
        this.generateFilename(this.props.book.title),
        // TODO: use mimeType variable once we fix the link type in our OPDS entries
        "application/vnd.adobe.adept+xml"
      );
    });
  }

  generateFilename(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + ".acsm";
  }
}
