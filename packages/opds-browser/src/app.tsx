import * as React from "react";
import * as ReactDOM from "react-dom";
import OPDSBrowser from "./components/OPDSBrowser";

class OPDSBrowserApp {
  browser: OPDSBrowser;

  constructor(config: any, elementId: string) {
    ReactDOM.render(
      <OPDSBrowser
        ref={(c) => this.browser = c}
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
    this.browser.root.getWrappedInstance().props.setCollectionAndBook(collectionUrl, bookUrl, skipOnNavigate);
  }
}

export = OPDSBrowserApp;