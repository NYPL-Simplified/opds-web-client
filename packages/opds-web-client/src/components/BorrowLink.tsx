import * as React from "react";
import { BookData } from "../interfaces";
const download = require("downloadjs");

export interface BorrowLinkProps extends React.HTMLProps<any> {
  book: BookData;
  borrow: (url: string) => Promise<any>;
}

export default class BorrowLink extends React.Component<BorrowLinkProps, any> {
  constructor(props) {
    super(props);
    this.borrow = this.borrow.bind(this);
  }

  render() {
    return (
      <a
        {...this.props}
        onClick={this.borrow}>
        {this.props.children}
      </a>
    );
  }

  borrow(event) {
    event.preventDefault();

    if (typeof document !== "undefined") {
      this.props.borrow(this.props.book.borrowUrl).then(blob => {
        download(
          blob,
          this.generateFilename(this.props.book.title),
          "application/vnd.adobe.adept+xml"
        );
      });
    }
  }

  generateFilename(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + ".acsm";
  }
}

