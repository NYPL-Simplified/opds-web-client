import * as React from "react";
import Link from "./Link";

export default class BookPreviewLink extends Link<BookPreviewLinkProps> {
  processClick() {
    this.props.setBook(this.props.book);
  }

  href() {
    let collectionUrl = encodeURIComponent(this.props.collectionUrl);
    let bookUrl = encodeURIComponent(this.props.book.url);
    return `?collection=${collectionUrl}&book=${bookUrl}`;
  }
}