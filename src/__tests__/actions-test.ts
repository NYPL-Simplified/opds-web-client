jest.dontMock("../actions");

let testData = {
  lanes: [],
  books: [{
    id: "test id",
    url: "http://example.com/book",
    title: "test title"
  }]
};
let mockFetchData = {
  resolve: true,
  fetchOPDSData(url) {
    return new Promise((resolve, reject) => {
      if (this.resolve) {
        resolve(testData);
      } else {
        reject("test error");
      }
    });
  }
};
jest.setMock("../fetchData", mockFetchData);

import {
  fetchCollection,
  fetchPage,
  fetchSearchDescription,
  FETCH_COLLECTION_REQUEST,
  FETCH_COLLECTION_SUCCESS,
  FETCH_COLLECTION_FAILURE,
  LOAD_COLLECTION,
  FETCH_PAGE_REQUEST,
  FETCH_PAGE_SUCCESS,
  FETCH_PAGE_FAILURE,
  LOAD_PAGE,
  LOAD_SEARCH_DESCRIPTION,
  LOAD_BOOK
} from "../actions";

describe("actions", () => {
  describe("fetchCollection", () => {
    let collectionUrl = "http://example.com/feed";

    it("dispatches request, load, and success", (done) => {
      let dispatch = jest.genMockFunction();
      mockFetchData.resolve = true;

      fetchCollection(collectionUrl)(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[0][0].type).toBe(FETCH_COLLECTION_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(LOAD_COLLECTION);
        expect(dispatch.mock.calls[2][0].type).toBe(FETCH_COLLECTION_SUCCESS);
        expect(data).toBe(testData);
        done();
      });
    });

    it("dispatches failure", (done) => {
      let dispatch = jest.genMockFunction();
      mockFetchData.resolve = false;

      fetchCollection(collectionUrl)(dispatch).catch(err => {
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0].type).toBe(FETCH_COLLECTION_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(FETCH_COLLECTION_FAILURE);
        expect(err).toBe("test error");
        done();
      });
    });
  });

  describe("fetchPage", () => {

    it("dispatches request, load, and success", (done) => {
      let dispatch = jest.genMockFunction();
      mockFetchData.resolve = true;

      fetchPage("http://example.com/feed")(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[0][0].type).toBe(FETCH_PAGE_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(LOAD_PAGE);
        expect(dispatch.mock.calls[2][0].type).toBe(FETCH_PAGE_SUCCESS);
        expect(data).toBe(testData);
        done();
      });
    });

    it("dispatches failure", (done) => {
      let dispatch = jest.genMockFunction();
      mockFetchData.resolve = false;

      fetchPage("http://example.com/feed")(dispatch).catch(err => {
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0].type).toBe(FETCH_PAGE_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(FETCH_PAGE_FAILURE);
        expect(err).toBe("test error");
        done();
      });
    });
  });

  describe("fetchSearchDescription", () => {
    it("dispatches load", (done) => {
      let dispatch = jest.genMockFunction();
      mockFetchData.resolve = true;

      fetchSearchDescription("http://example.com/search")(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0][0].type).toBe(LOAD_SEARCH_DESCRIPTION);
        expect(data).toBe(testData);
        done();
      }).catch(done);
    });
  });
});