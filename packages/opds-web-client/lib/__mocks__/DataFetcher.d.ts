import DataFetcher from "../DataFetcher";
export default class MockDataFetcher extends DataFetcher {
    resolve: boolean;
    testData: any;
    testError: any;
    fetchOPDSData(url: any): Promise<Response>;
    fetchSearchDescriptionData(url: any): Promise<Response>;
    fetch(url: string, options?: {}): Promise<Response>;
    getAuthCredentials(): {
        provider: string;
        credentials: string;
    };
}
