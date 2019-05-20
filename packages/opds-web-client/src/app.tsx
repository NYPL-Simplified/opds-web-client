import * as React from "react";
import * as ReactDOM from "react-dom";
import { PropTypes } from "prop-types";
import { Router, Route, browserHistory } from "react-router";
import OPDSCatalog from "./components/OPDSCatalog";
import { RootProps } from "./components/Root";
import { PathFor } from "./interfaces";
import AuthPlugin from "./AuthPlugin";
import "./stylesheets/app.scss";

const OPDSCatalogRouterHandler = (config) => {
  interface OPDSCatalogParams {
    collectionUrl: string;
    bookUrl: string;
  }
  interface OPDSCatalogProps {
    params?: OPDSCatalogParams;
  }
  class OPDSCatalogRoute extends React.Component<OPDSCatalogProps, {}> {
    static contextTypes: {
      router: PropTypes.object.isRequired
    };

    static childContextTypes: React.ValidationMap<{}> = {
      pathFor: PropTypes.func.isRequired
    };

    getChildContext() {
      return {
        pathFor: config.pathFor,
      };
    }
    render() {
      let { collectionUrl, bookUrl } = this.props.params;
      let mergedProps: RootProps = {
        ...config,
        collectionUrl,
        bookUrl
      };
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
