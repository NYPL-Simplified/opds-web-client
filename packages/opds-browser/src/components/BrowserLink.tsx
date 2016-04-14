import * as React from "react";
import { Link } from "react-router";
import { NavigateContext } from "../interfaces";

export interface BrowserLinkProps extends React.HTMLProps<any> {
  collectionUrl?: string;
  bookUrl?: string;
  isTopLevel?: boolean;
}

export default class BrowserLink extends React.Component<BrowserLinkProps, any> {
  context: NavigateContext;

  static contextTypes = {
    pathFor: React.PropTypes.func.isRequired
  };

  render(): JSX.Element {
    let { collectionUrl, bookUrl } = this.props;
    collectionUrl = collectionUrl ? encodeURIComponent(collectionUrl) : null;
    bookUrl = bookUrl ? encodeURIComponent(bookUrl) : null;
    let location = {
      pathname: this.context.pathFor(collectionUrl, bookUrl),
      state: { isTopLevel: true }
    };

    return (
      <Link to={location} {...this.props} />
    );
  }
}