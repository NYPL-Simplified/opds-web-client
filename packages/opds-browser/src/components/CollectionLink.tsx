import * as React from "react";
import Link, { LinkProps} from "./Link";
import { Navigate, PathFor } from "../interfaces";

export interface CollectionLinkProps extends LinkProps {
  navigate?: Navigate;
  pathFor?: PathFor;
  isTopLevel?: boolean;
}

export default class CollectionLink extends Link<CollectionLinkProps> {
  processClick() {
    if (this.props.navigate) {
      this.props.navigate(this.props.url, null, this.props.isTopLevel);
    }
  }

  href() {
    if (this.props.pathFor) {
      return this.props.pathFor(this.props.url, null);
    }
  }
}