import * as React from "react";
import Link, { LinkProps } from "./Link";

export interface BookPreviewLinkProps extends LinkProps, BookActionProps, BaseProps {
  book?: BookData;
}

export default class BookPreviewLink extends Link<BookPreviewLinkProps> {
  processClick() {
    this.props.navigate(this.props.collectionUrl, this.props.book.url || this.props.book.id || null);
  }

  href() {
    if (this.props.pathFor) {
      return this.props.pathFor(this.props.collectionUrl, this.props.url);
    }
  }
}