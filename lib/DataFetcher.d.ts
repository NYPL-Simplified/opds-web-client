import { OPDSFeed, OPDSEntry } from "opds-feed-parser";
import { AuthCredentials } from "./interfaces";
export interface RequestError {
    status: number | null;
    response: string;
    url: string;
    headers?: any;
}
export interface RequestRejector {
    (err: RequestError): any;
}
export interface DataFetcherConfig {
    /** If `proxyUrl` is provided, requests will be posted to the proxy url instead
        of the original url, to get around CORS restrictions. The proxy server should
        get the original url out of the form data, make the request, and return
        the response. */
    proxyUrl?: string;
    /** Function to convert OPDS data to an internal format needed by the application. */
    adapter?: (data: OPDSFeed | OPDSEntry, url: string) => any;
}
/** Handles requests to OPDS servers. */
export default class DataFetcher {
    authKey: string;
    private proxyUrl?;
    private adapter?;
    constructor(config?: DataFetcherConfig);
    fetchOPDSData(url: string): Promise<unknown>;
    fetchSearchDescriptionData(searchDescriptionUrl: string): Promise<unknown>;
    fetch(url: string, options?: {}): Promise<Response>;
    setAuthCredentials(credentials?: AuthCredentials): void;
    getAuthCredentials(): AuthCredentials | undefined;
    clearAuthCredentials(): void;
    prepareAuthHeaders(headers?: any): any;
    isErrorCode(status: number): boolean;
}
