import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from "redux";
import Root, { RootProps } from "./Root";
import buildStore from "../store";
import { State } from "../state";

export interface OPDSCatalogProps {
  collectionUrl?: string;
  bookUrl?: string;
  headerTitle?: string;
  pageTitleTemplate: (collectionTitle: string, bookTitle: string) => string;
  proxyUrl?: string;
  initialState?: State;
}

export default class OPDSCatalog extends React.Component<OPDSCatalogProps, any> {
  store: Redux.Store<State>;

  constructor(props) {
    super(props);
    this.store = buildStore(this.props.initialState || undefined);
  }

  render(): JSX.Element {
    let props = Object.assign({}, this.props, { store: this.store });

    return (
      <Root {...props} />
    );
  }
}