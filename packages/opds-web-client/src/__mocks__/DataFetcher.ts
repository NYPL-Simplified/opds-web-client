export default class MockDataFetcher {
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
};