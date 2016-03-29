import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware } from "redux";
import * as thunk from "redux-thunk";
import reducers from "../reducers/index";
import Root from "./Root";

export default class OPDSBrowser extends React.Component<RootProps, any> {
  store: Redux.Store;
  root: any;

  constructor(props) {
    super(props);

    if (this.props.store) {
      this.store = this.props.store;
    } else {
      this.store = createStore(
        combineReducers({ browser: reducers }),
        applyMiddleware(thunk)
      );
    }
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
}