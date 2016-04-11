import * as React from "react";
import * as ReactDOM from "react-dom";
import OPDSBrowser from "./components/OPDSBrowser";
import { RootProps } from "./components/Root";

class OPDSBrowserApp {
  elementId: string;
  props: RootProps;

  constructor(config: any, elementId: string) {
    this.elementId = elementId;
    this.props = config;
    this.render(config.collectionUrl, config.bookUrl, false);
  }

  render(collectionUrl: string = null, bookUrl: string = null, isTopLevel: boolean = false) {
    let props = Object.assign({}, this.props, { collectionUrl, bookUrl, isTopLevel });
    ReactDOM.render(
      <OPDSBrowser {...props} />,
      document.getElementById(this.elementId)
    );
  }
}

export = OPDSBrowserApp;