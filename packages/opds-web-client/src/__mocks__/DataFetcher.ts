import { stub } from "sinon";

import DataFetcher from "../DataFetcher";

export default class MockDataFetcher extends DataFetcher {
  resolve: boolean = true;
  testData: any = "test";
  testError: any = "test error";

  fetchOPDSData(url) {
    return this.fetch(url);
  }

  fetchSearchDescriptionData(url) {
    return this.fetch(url);
  }

  fetch(url: string, options = {}): Promise<Response> {
    return new Promise((resolve, reject) => {
      if (this.resolve) {
        resolve(this.testData);
      } else {
        reject(this.testError);
      }
    });
  }

  getAuthCredentials() {
    return { provider: "test", credentials: "credentials" };
  }
}

MockDataFetcher.prototype.setAuthCredentials = stub();
MockDataFetcher.prototype.clearAuthCredentials = stub();
