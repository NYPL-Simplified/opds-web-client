import * as React from "react";
import * as PropTypes from "prop-types";
import { Link, Router } from "react-router";
import { NavigateContext, Router as RouterType } from "../interfaces";

export interface CatalogLinkProps extends React.HTMLProps<{}> {
  collectionUrl?: string | null;
  bookUrl?: string | null;
}

/** Shows a link to another collection or book in the same OPDS catalog. */
export default class CatalogLink extends React.Component<CatalogLinkProps, {}> {
  context: NavigateContext;

  static contextTypes: React.ValidationMap<NavigateContext> = {
    router: PropTypes.object.isRequired as React.Validator<RouterType>,
    pathFor: PropTypes.func.isRequired
  };

  static childContextTypes: React.ValidationMap<NavigateContext> = {
    router: PropTypes.object.isRequired as React.Validator<RouterType>
  };

  // provides full router context expected by but not actually used by Link
  // see https://github.com/reactjs/react-router/blob/master/docs/API.md#contextrouter
  // and https://github.com/reactjs/react-router/blob/master/modules/PropTypes.js
  getChildContext() {
    let noop = () => {};
    let router: any = Object.assign({}, this.context.router, {
      replace: noop,
      go: noop,
      goBack: noop,
      goForward: noop,
      setRouteLeaveHook: noop
    });

    return { router };
  }

  render(): JSX.Element {
    let { collectionUrl = null, bookUrl = null, ref, ...props } = this.props;

    let location = this.context.pathFor(collectionUrl, bookUrl);

    return <Link to={location} {...props} />;
  }
}
