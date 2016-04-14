import * as React from "react";
import * as ReactDOM from "react-dom";
import Root, { RootProps } from "./Root";
import buildStore from "../store";
import { NavigateContext } from "../interfaces";

export interface OPDSBrowserProps {
  headerTitle?: string;
  pageTitleTemplate: (collectionTitle: string, bookTitle: string) => string;
  proxyUrl?: string;
  pathFor?: (collectionUrl: string, bookUrl: string) => string;
  store?: Redux.Store;
}

export default class OPDSBrowser extends React.Component<OPDSBrowserProps, any> {
  store: Redux.Store;

  constructor(props) {
    super(props);
    this.store = this.props.store || buildStore();
  }

  static childContextTypes = {
    pathFor: React.PropTypes.func.isRequired
  };

  getChildContext(): NavigateContext {
    return {
      pathFor: this.props.pathFor
    };
  }

  render(): JSX.Element {
    return (
      <Root
        store={this.store}
        {...this.props} />
    );
  }
}