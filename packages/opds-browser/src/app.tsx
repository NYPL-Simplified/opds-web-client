import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Route, browserHistory } from 'react-router';
import OPDSBrowser from "./components/OPDSBrowser";
import { RootProps } from "./components/Root";

// interface AppProps {
//   headerTitle?: string;
//   proxyUrl?: string;
//   pageTitleTemplate?: (collectionTitle: string, bookTitle: string) => string;
//   baseCollectionUrl?: string;
//   baseBookUrl?: string;
//   navigate?: any;
// }

class OPDSBrowserApp {
  elementId: string;
  BrowserRouteHandler: any;

  constructor(config: any, elementId: string) {
    this.elementId = elementId;

    this.BrowserRouteHandler = React.createClass({
      contextTypes: {
        router: React.PropTypes.object.isRequired
      },
      render: function() {
        let { collectionUrl, bookUrl } = this.props.params;
        // collectionUrl = collectionUrl ? ((config.baseCollectionUrl || "") + collectionUrl) : "";
        // bookUrl = bookUrl ? ((config.baseBookUrl || "") + bookUrl) : "";
        let navigate = (collectionUrl, bookUrl) => {
          let url = "/";
          url += collectionUrl ? "collection/" + encodeURIComponent(collectionUrl) : "";
          url += bookUrl ? "/book/" + encodeURIComponent(bookUrl) : "";
          console.log("navigating to:", url);
          this.context.router.push(url);
        };
        let mergedProps: RootProps = Object.assign(config, {
          collectionUrl: collectionUrl ? decodeURIComponent(collectionUrl) : null,
          bookUrl: bookUrl ? decodeURIComponent(bookUrl) : null,
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
        <Route path="/(collection/:collectionUrl)(/)(book/:bookUrl)" component={BrowserRouteHandler} />
      </Router>,
      document.getElementById(this.elementId)
    );
  }
}

export = OPDSBrowserApp;