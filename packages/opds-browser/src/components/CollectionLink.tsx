import * as React from "react";
import Link from "./Link";

export default class CollectionLink extends Link<CollectionLinkProps> {
  processClick() {
    this.props.setCollection(this.props.url);
  }

  href() {
    if (this.props.pathFor) {
      return this.props.pathFor(this.props.url, null);
    }
  }
}