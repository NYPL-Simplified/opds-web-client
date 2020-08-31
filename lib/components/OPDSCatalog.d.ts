import * as React from "react";
import { State } from "../state";
import AuthPlugin from "../AuthPlugin";
export interface OPDSCatalogProps {
    collectionUrl?: string;
    bookUrl?: string;
    authPlugins?: AuthPlugin[];
    pageTitleTemplate?: (collectionTitle: string, bookTitle: string) => string;
    proxyUrl?: string;
    initialState?: State;
    epubReaderUrlTemplate?: (epubUrl: string) => string;
}
/**
 * The main application component.
 *  - Renders root and passes props along with store to root
 *  - Creates the redux store using OPDSStore
 *  - Consumes and passes it down
 *  - Passes the redux store down the tree in context
 */
declare const OPDSCatalog: React.FunctionComponent<OPDSCatalogProps>;
export default OPDSCatalog;
