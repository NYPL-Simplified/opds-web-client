import * as React from "react";
import * as ReactDOM from "react-dom";
import Root from "./Root";
import buildStore from "../store";

export default class OPDSBrowser extends React.Component<RootProps, any> {
  store: Redux.Store;

  constructor(props) {
    super(props);
    this.store = this.props.store || buildStore();
  }

  render(): JSX.Element {
    return (
      <Root
        store={this.store}
        {...this.props} />
    );
  }
}