import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
let thunk: any = require("redux-thunk");
import reducers from "../reducers/index";
import { initialState as collectionState } from "../reducers/collection";
import { initialState as bookState } from "../reducers/book";
import Root from "./Root";

export default class OPDSBrowser extends React.Component<RootProps, any> {
  store: Redux.Store;
  root: any;

  constructor(props) {
    super(props);
    collectionState.url = this.props.collectionUrl;
    bookState.url = this.props.bookUrl;
    let initialState = {
      collection: collectionState,
      book: bookState
    };
    this.store = createStore(
      reducers,
      initialState,
      applyMiddleware(thunk)
    );
  }

  render(): JSX.Element {
    return (
      <Root
        ref={c => this.root = c}
        store={this.store}
        {...this.props} />
    );
  }

  getBookDetailsContainer() {
    return this.root.getWrappedInstance().bookDetailsContainer;
  }

  refreshBook() {
    return this.root.getWrappedInstance().props.refreshBook();
  }

  setCollectionAndBook(collectionUrl: string, bookUrl: string) {
    return this.root.getWrappedInstance().props.setCollectionAndBook(collectionUrl, bookUrl);
  }
}