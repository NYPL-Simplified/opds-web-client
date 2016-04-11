import * as React from "react";
import Link, { LinkProps} from "./Link";

export interface CollectionLinkProps extends LinkProps, CollectionActionProps {
}

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