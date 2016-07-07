import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from "redux";
import Root, { RootProps } from "./Root";
import buildStore from "../store";
import { State } from "../reducers/index";

export interface OPDSCatalogProps {
  collectionUrl?: string;
  bookUrl?: string;
  headerTitle?: string;
  pageTitleTemplate: (collectionTitle: string, bookTitle: string) => string;
  proxyUrl?: string;
  store?: Redux.Store<State>;
}

export default class OPDSCatalog extends React.Component<OPDSCatalogProps, any> {
  store: Redux.Store<State>;

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