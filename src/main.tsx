import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
let thunk: any = require('redux-thunk');
import reducers from './reducers/index';
import { Provider } from 'react-redux';
import Root from './components/Root';
import OPDSParser = require("opds-feed-parser");
import { feedToCollection } from "./OPDSDataAdapter";

let store = createStore(
  reducers,
  applyMiddleware(thunk)
);

// let startUrl = "http:\/\/oacontent.alpha.librarysimplified.org/preload";
// let startUrl = "http:\/\/oacontent.alpha.librarysimplified.org";
// let startUrl = "https:\/\/circulation.librarysimplified.org/feed/eng/English%20-%20Best%20Sellers?order=author";
// let startUrl = "https:\/\/circulation.librarysimplified.org";
// let startUrl = "http:\/\/feedbooks.github.io/opds-test-catalog/catalog/root.xml";
let startUrl;

let props = { startUrl };

ReactDOM.render(
  <Provider store={store}>
    <Root {...props} />
  </Provider>,
  document.getElementById("opds-browser")
);