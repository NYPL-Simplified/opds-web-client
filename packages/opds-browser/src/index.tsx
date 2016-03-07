import * as React from "react";
import * as ReactDOM from "react-dom";
import Browser from "./components/Browser";

class OPDSBrowser {
  browser: any;

  constructor(config: any, elementId: string) {
    ReactDOM.render(
      <Browser
        ref={(c) => this.browser = c}
        collectionUrl={config.collectionUrl}
        bookUrl={config.bookUrl}
        proxyUrl={config.proxyUrl}
        onNavigate={config.onNavigate}
        pathFor={config.pathFor}
        BookDetailsContainer={config.BookDetailsContainer} />,
      document.getElementById(elementId)
    );
  }

  loadCollectionAndBook(collectionUrl: string, bookUrl: string, skipOnNavigate: boolean = false) {
    this.browser.root.getWrappedInstance().props.setCollectionAndBook(collectionUrl, bookUrl, skipOnNavigate);
  }
}

Browser.App = OPDSBrowser;
export = Browser;