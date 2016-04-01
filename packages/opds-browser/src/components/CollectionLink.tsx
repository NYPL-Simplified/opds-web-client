import * as React from "react";
import Link from "./Link";

export default class CollectionLink extends Link<CollectionLinkProps> {
  processClick() {
    this.props.navigate(this.props.url, null, this.props.isTopLevel);
  }

  href() {
    if (this.props.pathFor) {
      return this.props.pathFor(this.props.url, null);
    }
  }
}