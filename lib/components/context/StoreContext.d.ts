import * as React from "react";
import * as Redux from "redux";
import { State } from "../../state";
import AuthPlugin from "../../AuthPlugin";
import { PathForContext } from "./PathForContext";
export declare type OPDSStoreProps = {
    initialState?: State;
    authPlugins?: AuthPlugin[];
    children: React.ReactNode;
    store?: Redux.Store<State>;
};
/**
 * Builds the redux store and makes it available in context via new API.
 * takes in the pathFor context. Will be used by OPDSCatalog
 * as well as circulation-patron-web.
 */
export default class OPDSStore extends React.Component<OPDSStoreProps> {
    static contextType: React.Context<import("../../interfaces").PathFor | undefined>;
    context: React.ContextType<typeof PathForContext>;
    store: Redux.Store<State>;
    constructor(props: any, pathFor: any);
    render(): JSX.Element;
}
export declare const ReduxContext: any;
