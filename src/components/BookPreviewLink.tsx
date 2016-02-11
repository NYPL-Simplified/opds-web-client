import * as React from "react";
import Link from "./Link";

export default class BookPreviewLink extends Link<BookLinkProps> {
  processClick() {
    this.props.showBookDetails(this.props.book);
  }

  href() {
    if (this.props.collectionUrl) {
      return `?url=${this.props.collectionUrl}&book=${this.props.url}`;
    } else {
      return `?book=${this.props.url}`;
    }
  }
}