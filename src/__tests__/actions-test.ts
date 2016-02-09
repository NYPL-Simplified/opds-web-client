jest.dontMock("../actions");
jest.setMock("../fetchData", {
  fetchOPDSData(url) {
    return new Promise((resolve, reject) => {
      resolve("test data");
    });
  }
});

import {
  fetchCollection,
  FETCH_COLLECTION_REQUEST,
  FETCH_COLLECTION_SUCCESS,
  LOAD_COLLECTION
} from "../actions";

describe("actions", () => {
  describe("fetchCollection", () => {
    it("does something", (done) => {
      let dispatch = jest.genMockFunction();

      fetchCollection("http://example.com/feed")(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[0][0].type).toBe(FETCH_COLLECTION_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(LOAD_COLLECTION);
        expect(dispatch.mock.calls[2][0].type).toBe(FETCH_COLLECTION_SUCCESS);
        expect(data).toEqual("test data");
        done();
      });
    });
  });
});