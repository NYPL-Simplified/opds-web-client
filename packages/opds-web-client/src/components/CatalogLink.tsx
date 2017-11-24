import * as React from "react";
import { PropTypes } from "prop-types";
import { Link } from "react-router";
import { NavigateContext } from "../interfaces";

export interface CatalogLinkProps extends React.HTMLProps<any> {
  collectionUrl?: string;
  bookUrl?: string;
}

export default class CatalogLink extends React.Component<CatalogLinkProps, void> {
  context: NavigateContext;

  static contextTypes: React.ValidationMap<NavigateContext> = {
    router: PropTypes.object.isRequired,
    pathFor: PropTypes.func.isRequired
  };

  static childContextTypes: React.ValidationMap<NavigateContext> = {
    router: PropTypes.object.isRequired
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

    let location = this.context.pathFor(collectionUrl, bookUrl);

    // remove props that Link won't recognize
    let props = Object.assign({}, this.props);
    delete props["collectionUrl"];
    delete props["bookUrl"];

    return (
      <Link to={location} {...props} />
    );
  }
}