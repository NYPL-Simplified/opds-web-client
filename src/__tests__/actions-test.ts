jest.dontMock("../actions");

import DataFetcher from "../DataFetcher";

let testData = {
  lanes: [],
  books: [{
    id: "test id",
    url: "http://example.com/book",
    title: "test title"
  }]
};

class MockDataFetcher extends DataFetcher {
  resolve: boolean = true;

  constructor() {
    super(null);
  }

  fetchOPDSData(url) {
    return new Promise((resolve, reject) => {
      if (this.resolve) {
        resolve(testData);
      } else {
        reject("test error");
      }
    });
  }

  fetchSearchDescriptionData(url) {
    return new Promise((resolve, reject) => {
      if (this.resolve) {
        resolve(testData);
      } else {
        reject("test error");
      }
    });
  }
};

let fetcher = new MockDataFetcher();

import {
  fetchCollection,
  fetchPage,
  fetchSearchDescription,
  fetchBook,
  FETCH_COLLECTION_REQUEST,
  FETCH_COLLECTION_SUCCESS,
  FETCH_COLLECTION_FAILURE,
  LOAD_COLLECTION,
  FETCH_PAGE_REQUEST,
  FETCH_PAGE_SUCCESS,
  FETCH_PAGE_FAILURE,
  LOAD_PAGE,
  LOAD_SEARCH_DESCRIPTION,
  FETCH_BOOK_REQUEST,
  FETCH_BOOK_SUCCESS,
  FETCH_BOOK_FAILURE,
  LOAD_BOOK,
} from "../actions";

describe("actions", () => {
  describe("fetchCollection", () => {
    let collectionUrl = "http://example.com/feed";

    it("dispatches request, load, and success", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = true;

      fetchCollection(collectionUrl, fetcher)(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[0][0].type).toBe(FETCH_COLLECTION_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(FETCH_COLLECTION_SUCCESS);
        expect(dispatch.mock.calls[2][0].type).toBe(LOAD_COLLECTION);
        expect(data).toBe(testData);
        done();
      }).catch(err => done.fail(err));
    });

    it("dispatches failure", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = false;

      fetchCollection(collectionUrl, fetcher)(dispatch).catch(err => {
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0].type).toBe(FETCH_COLLECTION_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(FETCH_COLLECTION_FAILURE);
        expect(err).toBe("test error");
        done();
      });
    });
  });

  describe("fetchPage", () => {

    it("dispatches request, success, and load", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = true;

      fetchPage("http://example.com/feed", fetcher)(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[0][0].type).toBe(FETCH_PAGE_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(FETCH_PAGE_SUCCESS);
        expect(dispatch.mock.calls[2][0].type).toBe(LOAD_PAGE);
        expect(data).toBe(testData);
        done();
      }).catch(err => done.fail(err));
    });

    it("dispatches failure", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = false;

      fetchPage("http://example.com/feed", fetcher)(dispatch).catch(err => {
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
      fetcher.resolve = true;

      fetchSearchDescription("http://example.com/search", fetcher)(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0][0].type).toBe(LOAD_SEARCH_DESCRIPTION);
        expect(data).toBe(testData);
        done();
      }).catch(err => done.fail(err));
    });
  });

  describe("fetchBook", () => {
    let bookUrl = "http://example.com/book";

    it("dispatches request, load, and success", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = true;

      fetchBook(bookUrl, fetcher)(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[0][0].type).toBe(FETCH_BOOK_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(FETCH_BOOK_SUCCESS);
        expect(dispatch.mock.calls[2][0].type).toBe(LOAD_BOOK);
        expect(data).toBe(testData);
        done();
      }).catch(err => done.fail(err));
    });

    it("dispatches failure", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = false;

      fetchBook(bookUrl, fetcher)(dispatch).catch(err => {
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0].type).toBe(FETCH_BOOK_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(FETCH_BOOK_FAILURE);
        expect(err).toBe("test error");
        done();
      });
    });
  });

});