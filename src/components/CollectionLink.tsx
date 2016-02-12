import * as React from "react";
import Link from "./Link";

export default class CollectionLink extends Link<CollectionLinkProps> {
  processClick() {
    this.props.fetchCollection(this.props.url);
  }

  href() {
    return "?url=" + encodeURIComponent(this.props.url);
  }
}