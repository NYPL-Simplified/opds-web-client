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

    // use server-provided initial state if available
    let hasPreloadedState = typeof window !== "undefined" ? (window as any).__PRELOADED_STATE__ : null;
    let initialState = hasPreloadedState ? (window as any).__PRELOADED_STATE__ : undefined;
    this.store = this.props.store || buildStore(initialState);
  }

  render(): JSX.Element {
    let props = Object.assign({}, this.props, { store: this.store });

    return (
      <Root {...props} />
    );
  }
}