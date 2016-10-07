import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from "redux";
import Root, { RootProps } from "./Root";
import buildStore from "../store";
import { State } from "../state";
import DataFetcher from "../DataFetcher";
import AuthPlugin from "../AuthPlugin";
import BasicAuthPlugin from "../BasicAuthPlugin";
import { NavigateContext } from "../interfaces";

export interface OPDSCatalogProps {
  collectionUrl?: string;
  bookUrl?: string;
  headerTitle?: string;
  authPlugins?: AuthPlugin[];
  pageTitleTemplate: (collectionTitle: string, bookTitle: string) => string;
  proxyUrl?: string;
  initialState?: State;
}

export default class OPDSCatalog extends React.Component<OPDSCatalogProps, any> {
  store: Redux.Store<State>;
  context: NavigateContext;

  static contextTypes: React.ValidationMap<NavigateContext> = {
    router: React.PropTypes.object.isRequired,
    pathFor: React.PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props);
    this.store = buildStore(this.props.initialState || undefined, this.props.authPlugins || [BasicAuthPlugin], context.pathFor);
  }

  render(): JSX.Element {
    let props: RootProps = Object.assign({}, this.props, {
      store: this.store
    });

    return (
      <Root {...props} />
    );
  }
}