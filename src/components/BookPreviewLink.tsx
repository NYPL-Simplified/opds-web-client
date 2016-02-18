import * as React from "react";
import Link from "./Link";

export default class BookPreviewLink extends Link<BookPreviewLinkProps> {
  processClick() {
    this.props.setBook(this.props.book);
  }

  href() {
    let collectionUrl = encodeURIComponent(this.props.collectionUrl);
    return `?collection=${collectionUrl}` + (
      this.props.url ? `&book=${encodeURIComponent(this.props.url)}` : ""
    );
  }
}