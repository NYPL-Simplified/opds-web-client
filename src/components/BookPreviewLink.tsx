import * as React from "react";
import Link from "./Link";

export default class BookPreviewLink extends Link<BookPreviewLinkProps> {
  processClick() {
    this.props.showBookDetails(this.props.book);
  }

  href() {
    return `?url=${this.props.collectionUrl}&book=${this.props.url}`;
  }
}