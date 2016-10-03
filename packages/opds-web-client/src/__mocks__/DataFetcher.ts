import { stub } from "sinon";

import DataFetcher from "../DataFetcher";

export default class MockDataFetcher extends DataFetcher {
  resolve: boolean = true;
  testData: any = "test";

  fetchOPDSData(url) {
    return this.fetch(url);
  }

  fetchSearchDescriptionData(url) {
    return this.fetch(url);
  }

  fetch(url) {
    return new Promise((resolve, reject) => {
      if (this.resolve) {
        resolve(this.testData);
      } else {
        reject("test error");
      }
    });
  }

  getAuthCredentials() {
    return { provider: "test", credentials: "credentials" };
  }
};

MockDataFetcher.prototype.setAuthCredentials = stub();
MockDataFetcher.prototype.clearAuthCredentials = stub();
