import * as React from "react";
import * as ReactDOM from "react-dom";
import Root from "./Root";
import buildStore from "../store";

export default class OPDSBrowser extends React.Component<RootProps, any> {
  store: Redux.Store;
  root: any;

  constructor(props) {
    super(props);
    this.store = this.props.store || buildStore();
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