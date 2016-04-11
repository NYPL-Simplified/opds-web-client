import * as React from "react";
import CollectionLink, { CollectionLinkProps } from "./CollectionLink";

export default class HeaderCollectionLink extends CollectionLink {
  processClick() {
    this.props.navigate(this.props.url, null, true);
  }
}