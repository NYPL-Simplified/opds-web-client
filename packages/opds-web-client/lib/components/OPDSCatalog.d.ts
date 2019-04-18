import * as React from "react";
import * as Redux from "redux";
import { State } from "../state";
import AuthPlugin from "../AuthPlugin";
import { NavigateContext } from "../interfaces";
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
    static contextTypes: React.ValidationMap<NavigateContext>;
    constructor(props: any, context: any);
    render(): JSX.Element;
}
