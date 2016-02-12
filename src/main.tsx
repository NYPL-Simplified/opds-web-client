import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
let thunk: any = require("redux-thunk");
import reducers from "./reducers/index";
import { Provider } from "react-redux";
import Root from "./components/Root";
import OPDSParser = require("opds-feed-parser");
import { feedToCollection } from "./OPDSDataAdapter";

export default class OPDSBrowser {
  root: any;

  constructor(config: any, elementId: string) {
    let store = createStore(
      reducers,
      applyMiddleware(thunk)
    );

    ReactDOM.render(
      <Provider store={store}>
        <Root
          ref={(c) => this.root = c}
          startCollection={config.startCollection}
          startBook={config.startBook}
          onFetchCollection={config.onFetchCollection} />
      </Provider>,
      document.getElementById(elementId)
    );
  }

  loadCollection(url: string, skipOnFetchCollection: boolean = false) {
    this.root.getWrappedInstance().props.fetchCollection(url, skipOnFetchCollection);
  }

  clearCollection() {
    this.root.getWrappedInstance().props.clearCollection();
  }
}