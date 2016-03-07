import * as React from "react";
import * as ReactDOM from "react-dom";
import Browser from "./components/Browser";

class OPDSBrowser {
  browser: any;
  Browser: any;

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

  loadCollection(url: string, skipOnNavigate: boolean = false, bookUrl?: string) {
    this.browser.root.getWrappedInstance().props.fetchCollection(url, skipOnNavigate, bookUrl);
  }

  loadCollectionAndBook(collectionUrl: string, bookUrl: string, skipOnNavigate: boolean = false) {
    this.browser.root.getWrappedInstance().props.setCollectionAndBook(collectionUrl, bookUrl, skipOnNavigate);
  }
}

var _extends = function (target: any, whatever: any) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }

  return target;
};

exports.App = OPDSBrowser;
exports['default'] = Browser;

module.exports = _extends(exports['default'], exports);

// export = OPDSBrowser;
// exports.Browser = Browser;
