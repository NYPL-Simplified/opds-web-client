import * as React from "react";
import { Provider, ReactReduxContext } from "react-redux";
import * as Redux from "redux";
import { State } from "../../state";
import AuthPlugin from "../../AuthPlugin";
import buildStore from "../../store";
import { PathForContext } from "./PathForContext";
import BasicAuthPlugin from "../../BasicAuthPlugin";

export type OPDSStoreProps = {
  initialState?: State;
  authPlugins?: AuthPlugin[];
  children: React.ReactNode;
  // we allow custom redux store to be passed in
  // so we can mock it during testing
  store?: Redux.Store<State>;
};
/**
 * Builds the redux store and makes it available in context via new API.
 * takes in the pathFor context. Will be used by OPDSCatalog
 * as well as circulation-patron-web.
 */
export default class OPDSStore extends React.Component<OPDSStoreProps> {
  static contextType = PathForContext;
  declare context: React.ContextType<typeof PathForContext>;

  store: Redux.Store<State>;

  constructor(props, pathFor) {
    super(props);
    this.store =
      props.store ??
      buildStore(
        this.props.initialState || undefined,
        this.props.authPlugins || [BasicAuthPlugin],
        pathFor
      );
  }

  render() {
    return <Provider store={this.store}>{this.props.children}</Provider>;
  }
}

export const ReduxContext = ReactReduxContext;
