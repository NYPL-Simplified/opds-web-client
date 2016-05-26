export default class MockDataFetcher {
  resolve: boolean = true;
  testData: any = "test";

  fetchOPDSData(url) {
    return new Promise((resolve, reject) => {
      if (this.resolve) {
        resolve(this.testData);
      } else {
        reject("test error");
      }
    });
  }

  fetchSearchDescriptionData(url) {
    return new Promise((resolve, reject) => {
      if (this.resolve) {
        resolve(this.testData);
      } else {
        reject("test error");
      }
    });
  }

};
