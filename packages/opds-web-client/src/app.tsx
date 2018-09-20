import * as React from "react";
import * as ReactDOM from "react-dom";
import { PropTypes } from "prop-types";
const createReactClass = require("create-react-class");
import { Router, Route, browserHistory } from "react-router";
import OPDSCatalog from "./components/OPDSCatalog";
import { RootProps } from "./components/Root";
import { PathFor } from "./interfaces";
import { State } from "./state";
import AuthPlugin from "./AuthPlugin";
import "./stylesheets/app.scss";

const OPDSCatalogRouterHandler = (config) => {
  interface OPDSCatalogProps {
    params?: any;
  }
  class OPDSCatalogRoute extends React.Component<OPDSCatalogProps, void> {
    static contextTypes: {
      router: PropTypes.object.isRequired
    };

    static childContextTypes: React.ValidationMap<void> = {
      pathFor: PropTypes.func.isRequired
    };

    getChildContext() {
      return {
        pathFor: config.pathFor,
      };
    }
    render() {
      let { collectionUrl, bookUrl } = this.props.params;
      let mergedProps: RootProps = Object.assign(config, {
        collectionUrl,
        bookUrl
      });
      return <OPDSCatalog {...mergedProps} />;
    };
  }

  return OPDSCatalogRoute;
};

/** Standalone app to be mounted in an existing DOM element. */
class OPDSWebClient {
  elementId: string;
  pathPattern: string;
  RouteHandler: any;

  constructor(config: {
    headerTitle?: string;
    proxyUrl?: string;
    authPlugins?: AuthPlugin[];
    pageTitleTemplate?: (collectionTitle: string, bookTitle: string) => string;
    pathPattern?: string;
    pathFor: PathFor;
  }, elementId: string) {
    this.elementId = elementId;
    this.pathPattern = config.pathPattern || "/(collection/:collectionUrl/)(book/:bookUrl/)";
    this.RouteHandler = OPDSCatalogRouterHandler(config);
    this.render();
  }

  render() {
    let RouteHandler = this.RouteHandler;
    ReactDOM.render(
      <Router history={browserHistory}>
        <Route path={this.pathPattern} component={RouteHandler} />
      </Router>,
      document.getElementById(this.elementId)
    );
  }
}

export = OPDSWebClient;
