import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import OPDSBrowser from "./components/OPDSBrowser";
import { RootProps } from "./components/Root";
import { PathFor } from "./interfaces";

class OPDSBrowserApp {
  elementId: string;
  pathPattern: string;
  BrowserRouteHandler: any;

  constructor(config: {
    headerTitle?: string;
    proxyUrl?: string;
    pageTitleTemplate?: (collectionTitle: string, bookTitle: string) => string;
    pathPattern?: string;
    pathFor: PathFor
  }, elementId: string) {
    this.elementId = elementId;
    this.pathPattern = config.pathPattern || "/(collection/:collectionUrl/)(book/:bookUrl/)";
    this.BrowserRouteHandler = React.createClass({
      contextTypes: {
        router: React.PropTypes.object.isRequired
      },
      childContextTypes: {
        pathFor: React.PropTypes.func.isRequired
      },
      getChildContext: function() {
        return {
          pathFor: config.pathFor
        };
      },
      render: function() {
        let { collectionUrl, bookUrl } = this.props.params;
        let isTopLevel = (this.props.location.state && this.props.location.state.isTopLevel) || false;
        let navigate = (collectionUrl, bookUrl) => {
          let url = config.pathFor(collectionUrl, bookUrl);
          this.context.router.push(url);
        };
        let mergedProps: RootProps = Object.assign(config, {
          collectionUrl: collectionUrl ? decodeURIComponent(collectionUrl) : null,
          bookUrl: bookUrl ? decodeURIComponent(bookUrl) : null,
          isTopLevel,
          navigate
        });
        return <OPDSBrowser {...mergedProps} />;
      }
    });

    this.render();
  }

  render() {
    let BrowserRouteHandler = this.BrowserRouteHandler;
    ReactDOM.render(
      <Router history={browserHistory}>
        <Route path={this.pathPattern} component={BrowserRouteHandler} />
      </Router>,
      document.getElementById(this.elementId)
    );
  }
}

export = OPDSBrowserApp;