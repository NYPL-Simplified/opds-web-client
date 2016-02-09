import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
let thunk: any = require('redux-thunk');
import reducers from './reducers/index';
import { Provider } from 'react-redux';
import Root from './components/Root';
import OPDSParser = require("opds-feed-parser");
import { feedToCollection } from "./OPDSDataAdapter";
import * as queryString from "query-string";

export default class OPDSBrowser {
  constructor(config: any, elementId: string) {
    let store = createStore(
      reducers,
      applyMiddleware(thunk)
    );

    let startUrl = queryString.parse(window.location.search).url || config.startUrl;

    ReactDOM.render(
      <Provider store={store}>
        <Root startUrl={startUrl} />
      </Provider>,
      document.getElementById(elementId)
    );
  }
}