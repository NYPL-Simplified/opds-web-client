import * as React from "react";
import * as PropTypes from "prop-types";
import * as Redux from "redux";
import Root, { RootProps } from "./Root";
import buildStore from "../store";
import { State } from "../state";
import AuthPlugin from "../AuthPlugin";
import BasicAuthPlugin from "../BasicAuthPlugin";
import { NavigateContext, Router as RouterType } from "../interfaces";

export interface OPDSCatalogProps {
  collectionUrl?: string;
  bookUrl?: string;
  authPlugins?: AuthPlugin[];
  pageTitleTemplate?: (collectionTitle: string, bookTitle: string) => string;
  proxyUrl?: string;
  initialState?: State;
  epubReaderUrlTemplate?: (epubUrl: string) => string;
}

/** The main application component. */
export default class OPDSCatalog extends React.Component<OPDSCatalogProps, {}> {
  store: Redux.Store<State>;
  context: NavigateContext;

  static contextTypes: React.ValidationMap<NavigateContext> = {
    router: PropTypes.object.isRequired as React.Validator<RouterType>,
    pathFor: PropTypes.func.isRequired
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