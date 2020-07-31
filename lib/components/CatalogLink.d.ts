import * as React from "react";
import { NavigateContext } from "../interfaces";
export interface CatalogLinkProps extends React.HTMLProps<{}> {
    collectionUrl?: string | null;
    bookUrl?: string | null;
}
/** Shows a link to another collection or book in the same OPDS catalog. */
export default class CatalogLink extends React.Component<CatalogLinkProps, {}> {
    context: NavigateContext;
    static contextTypes: React.ValidationMap<NavigateContext>;
    static childContextTypes: React.ValidationMap<NavigateContext>;
    getChildContext(): {
        router: any;
    };
    render(): JSX.Element;
}
