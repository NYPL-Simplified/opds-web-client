import * as React from "react";
import * as ReactDOM from "react-dom";
import OPDSBrowser from "./components/OPDSBrowser";

import { createStore, applyMiddleware } from "redux";
let thunk: any = require("redux-thunk");
import reducers from "./reducers/index";

class OPDSBrowserApp {
  browser: any;

  constructor(config: any, elementId: string) {
    let store = createStore(
      reducers,
      applyMiddleware(thunk)
    );

    ReactDOM.render(
      <OPDSBrowser
        ref={(c) => this.browser = c}
        store={store}
        collection={config.collection}
        book={config.book}
        proxyUrl={config.proxyUrl}
        onNavigate={config.onNavigate}
        pathFor={config.pathFor}
        BookDetailsContainer={config.BookDetailsContainer} />,
      document.getElementById(elementId)
    );
  }

  setCollectionAndBook(collectionUrl: string, bookUrl: string, skipOnNavigate: boolean = false) {
    this.browser.getWrappedInstance().props.setCollectionAndBook(collectionUrl, bookUrl, skipOnNavigate);
  }
}

export = OPDSBrowserApp;