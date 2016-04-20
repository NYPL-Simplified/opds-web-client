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
    router: React.PropTypes.object.isRequired,
    pathFor: React.PropTypes.func.isRequired
  };

  static childContextTypes: React.ValidationMap<NavigateContext> = {
    router: React.PropTypes.object.isRequired
  };

  // provides full router context expected by but not actually used by Link
  // see https://github.com/reactjs/react-router/blob/master/docs/API.md#contextrouter
  // and https://github.com/reactjs/react-router/blob/master/modules/PropTypes.js
  getChildContext() {
    let noop = () => {};
    let router = Object.assign({}, this.context.router, {
      replace: noop,
      go: noop,
      goBack: noop,
      goForward: noop,
      setRouteLeaveHook: noop,
    });

    return { router };
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