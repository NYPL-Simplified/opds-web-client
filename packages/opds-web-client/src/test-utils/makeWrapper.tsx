import * as React from "react";
import { fake } from "sinon";
import PathForProvider from "../components/context/PathForContext";
import { ActionsProvider } from "../components/context/ActionsContext";
import OPDSStore from "../components/context/StoreContext";
import { PathFor } from "../interfaces";
import { State } from "../state";
import AuthPlugin from "../AuthPlugin";

type WrapperConfig = {
  pathFor?: PathFor;
  proxyUrl?: string;
  initialState?: State;
  authPlugins?: AuthPlugin[];
};

const defaultPathFor = fake((collectionUrl?: string, bookUrl?: string) =>
  `/${collectionUrl}` + bookUrl ? `/${bookUrl}` : ""
);

/**
 * This creates the wrapper component that can then be passed
 * to renderHook
 */
type MakeWrapper = (config?: WrapperConfig) => React.FC;
const makeWrapper: MakeWrapper = (config = {}) => ({ children }) => {
  const {
    pathFor = defaultPathFor,
    proxyUrl,
    initialState,
    authPlugins
  } = config;

  return (
    <PathForProvider pathFor={pathFor}>
      <ActionsProvider>
        <OPDSStore initialState={initialState} authPlugins={authPlugins}>
          {children}
        </OPDSStore>
      </ActionsProvider>
    </PathForProvider>
  );
};

export default makeWrapper;
