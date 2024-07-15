import * as React from "react";
import { fake } from "sinon";
import PathForProvider from "../components/context/PathForContext";
import { ActionsProvider } from "../components/context/ActionsContext";
import OPDSStore from "../components/context/StoreContext";
import { PathFor, AuthMethod } from "../interfaces";
import { State } from "../state";
import AuthPlugin from "../AuthPlugin";
import ActionsCreator from "../actions";
import DataFetcher from "../DataFetcher";
import { adapter } from "../OPDSDataAdapter";
import buildStore from "../store";
import BasicAuthPlugin from "../BasicAuthPlugin";
import * as Redux from "redux";

type WrapperConfig = {
  pathFor?: PathFor;
  proxyUrl?: string;
  initialState?: State;
  authPlugins?: AuthPlugin<AuthMethod>[];
};

const defaultPathFor = fake((collectionUrl?: string, bookUrl?: string) =>
  `/${collectionUrl}` + bookUrl ? `/${bookUrl}` : ""
);

/**
 * This creates a wrapper component, and returns some global context
 * which can be used to spy / mock actions, fetcher, etc
 */
type MakeWrapper = (config?: WrapperConfig) => {
  wrapper: React.FC;
  actions: ActionsCreator;
  fetcher: DataFetcher;
  store: Redux.Store<State>;
};
const makeWrapper: MakeWrapper = (config = {}) => {
  const {
    pathFor = defaultPathFor,
    proxyUrl,
    initialState,
    authPlugins
  } = config;

  const fetcher = new DataFetcher({ adapter, proxyUrl });
  const actions = new ActionsCreator(fetcher);

  const store = buildStore(
    initialState || undefined,
    authPlugins || [BasicAuthPlugin],
    pathFor
  );

  return {
    store,
    actions,
    fetcher,
    wrapper: ({ children }) => {
      return (
        <PathForProvider pathFor={pathFor}>
          <ActionsProvider actions={actions} fetcher={fetcher}>
            <OPDSStore store={store}>{children}</OPDSStore>
          </ActionsProvider>
        </PathForProvider>
      );
    }
  };
};

export default makeWrapper;
