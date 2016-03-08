import * as React from "react";
import * as ReactDOM from "react-dom";
import OPDSBrowser from "./components/OPDSBrowser";

class OPDSBrowserApp {
  browser: any;

  constructor(config: any, elementId: string) {
    ReactDOM.render(
      <OPDSBrowser
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

OPDSBrowser.App = OPDSBrowserApp;
export = OPDSBrowser;