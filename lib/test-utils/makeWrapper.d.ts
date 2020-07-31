import * as React from "react";
import { PathFor } from "../interfaces";
import { State } from "../state";
import AuthPlugin from "../AuthPlugin";
import ActionsCreator from "../actions";
import DataFetcher from "../DataFetcher";
import * as Redux from "redux";
declare type WrapperConfig = {
    pathFor?: PathFor;
    proxyUrl?: string;
    initialState?: State;
    authPlugins?: AuthPlugin[];
};
/**
 * This creates a wrapper component, and returns some global context
 * which can be used to spy / mock actions, fetcher, etc
 */
declare type MakeWrapper = (config?: WrapperConfig) => {
    wrapper: React.FC;
    actions: ActionsCreator;
    fetcher: DataFetcher;
    store: Redux.Store<State>;
};
declare const makeWrapper: MakeWrapper;
export default makeWrapper;
