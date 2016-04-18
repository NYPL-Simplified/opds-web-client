import * as React from "react";
import { Link } from "react-router";
import { NavigateContext } from "../../interfaces";

export interface BrowserLinkProps extends React.HTMLProps<any> {
  collectionUrl?: string;
  bookUrl?: string;
  isTopLevel?: boolean;
}

export default class BrowserLink extends React.Component<BrowserLinkProps, any> {
  context: NavigateContext;

  static contextTypes = {
    pathFor: React.PropTypes.func // not required in mock
  };

  render(): JSX.Element {
    let { collectionUrl, bookUrl } = this.props;
    collectionUrl = collectionUrl || "";
    bookUrl = bookUrl || "";
    let pathFor = this.context.pathFor || ((c, b) => c + "::" + b);

    let location = {
      pathname: pathFor(collectionUrl, bookUrl),
      state: { isTopLevel: this.props.isTopLevel }
    };

    return (
      <Link to={location} {...this.props} />
    );
  }
}