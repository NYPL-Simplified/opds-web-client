import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PropTypes from "prop-types";
import { Router, Route, browserHistory } from "react-router";
import OPDSCatalog from "./components/OPDSCatalog";
import { RootProps } from "./components/Root";
import { PathFor } from "./interfaces";
import AuthPlugin from "./AuthPlugin";
import "./stylesheets/app.scss";
import PathForProvider from "./components/context/PathForContext";
import { ActionsProvider } from "./components/context/ActionsContext";
import { adapter } from "./OPDSDataAdapter";
import DataFetcher from "./DataFetcher";
import ActionsCreator from "./actions";

const OPDSCatalogRouterHandler = config => {
  interface OPDSCatalogParams {
    collectionUrl: string;
    bookUrl: string;
  }
  interface OPDSCatalogProps {
    params?: OPDSCatalogParams;
  }
  class OPDSCatalogRoute extends React.Component<OPDSCatalogProps, {}> {
    static contextTypes = {
      router: PropTypes.object.isRequired
    };

    render() {
      let { collectionUrl, bookUrl } = this.props.params ?? {};
      let mergedProps: RootProps = {
        ...config,
        collectionUrl,
        bookUrl
      };

      const fetcher = new DataFetcher({ adapter, proxyUrl: config.proxyUrl });
      const actions = new ActionsCreator(fetcher);
      return (
        <PathForProvider pathFor={config.pathFor}>
          <ActionsProvider actions={actions} fetcher={fetcher}>
            <OPDSCatalog {...mergedProps} />
          </ActionsProvider>
        </PathForProvider>
      );
    }
  }

  return OPDSCatalogRoute;
};

/** Standalone app to be mounted in an existing DOM element. */
class OPDSWebClient {
  elementId: string;
  pathPattern: string;
  RouteHandler: any;

  constructor(
    config: {
      headerTitle?: string;
      proxyUrl?: string;
      authPlugins?: AuthPlugin[];
      pageTitleTemplate?: (
        collectionTitle: string,
        bookTitle: string
      ) => string;
      pathPattern?: string;
      pathFor: PathFor;
    },
    elementId: string
  ) {
    this.elementId = elementId;
    this.pathPattern =
      config.pathPattern || "/(collection/:collectionUrl/)(book/:bookUrl/)";
    this.RouteHandler = OPDSCatalogRouterHandler(config);
    this.render();
  }

  render() {
    let RouteHandler = this.RouteHandler;

    // `react-axe` should only run in development and testing mode.
    // Running this is resource intensive and should only be used to test
    // for accessibility and not during active development.
    if (process.env.TEST_AXE === "true") {
      let axe = require("react-axe");
      axe(React, ReactDOM, 1000);
    }

    ReactDOM.render(
      <Router history={browserHistory}>
        <Route path={this.pathPattern} component={RouteHandler} />
      </Router>,
      document.getElementById(this.elementId)
    );
  }
}

export = OPDSWebClient;
