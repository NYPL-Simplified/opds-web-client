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

  static contextTypes: React.ValidationMap<NavigateContext> = {
    pathFor: React.PropTypes.func.isRequired
  };

  render(): JSX.Element {
    let { collectionUrl, bookUrl } = this.props;
    collectionUrl = collectionUrl || null;
    bookUrl = bookUrl || null;

    let location = {
      pathname: this.context.pathFor(collectionUrl, bookUrl),
      state: { isTopLevel: this.props.isTopLevel }
    };

    return (
      <Link to={location} {...this.props} />
    );
  }
}