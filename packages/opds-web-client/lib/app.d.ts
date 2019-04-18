import { PathFor } from "./interfaces";
import AuthPlugin from "./AuthPlugin";
import "./stylesheets/app.scss";
/** Standalone app to be mounted in an existing DOM element. */
declare class OPDSWebClient {
    elementId: string;
    pathPattern: string;
    RouteHandler: any;
    constructor(config: {
        headerTitle?: string;
        proxyUrl?: string;
        authPlugins?: AuthPlugin[];
        pageTitleTemplate?: (collectionTitle: string, bookTitle: string) => string;
        pathPattern?: string;
        pathFor: PathFor;
    }, elementId: string);
    render(): void;
}
export = OPDSWebClient;
