jest.dontMock("../actions");


let testData = {
  lanes: [],
  books: [{
    id: "test id",
    url: "http://example.com/book",
    title: "test title"
  }]
};

import DataFetcher from "../DataFetcher";
let fetcher = new DataFetcher(null, null) as any;
fetcher.testData = testData;

import ActionsCreator from "../actions";
let actions = new ActionsCreator(fetcher);

describe("actions", () => {
  describe("fetchCollection", () => {
    let collectionUrl = "http://example.com/feed";

    it("dispatches request, load, and success", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = true;

      actions.fetchCollection(collectionUrl)(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.FETCH_COLLECTION_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(actions.FETCH_COLLECTION_SUCCESS);
        expect(dispatch.mock.calls[2][0].type).toBe(actions.LOAD_COLLECTION);
        expect(data).toBe(testData);
        done();
      }).catch(err => done.fail(err));
    });

    it("dispatches failure", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = false;

      actions.fetchCollection(collectionUrl)(dispatch).catch(err => {
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.FETCH_COLLECTION_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(actions.FETCH_COLLECTION_FAILURE);
        expect(err).toBe("test error");
        done();
      });
    });

    it("passes isTopLevel to loadCollection", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = true;

      actions.fetchCollection(collectionUrl, true)(dispatch).then(data => {
        expect(dispatch.mock.calls[2][0].type).toBe(actions.LOAD_COLLECTION);
        expect(dispatch.mock.calls[2][0].isTopLevel).toBe(true);
        done();
      }).catch(err => done.fail(err));
    });
  });

  describe("fetchPage", () => {

    it("dispatches request, success, and load", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = true;

      actions.fetchPage("http://example.com/feed")(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.FETCH_PAGE_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(actions.FETCH_PAGE_SUCCESS);
        expect(dispatch.mock.calls[2][0].type).toBe(actions.LOAD_PAGE);
        expect(data).toBe(testData);
        done();
      }).catch(err => done.fail(err));
    });

    it("dispatches failure", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = false;

      actions.fetchPage("http://example.com/feed")(dispatch).catch(err => {
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.FETCH_PAGE_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(actions.FETCH_PAGE_FAILURE);
        expect(err).toBe("test error");
        done();
      });
    });
  });

  describe("fetchSearchDescription", () => {
    it("dispatches load", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = true;

      actions.fetchSearchDescription("http://example.com/search")(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.LOAD_SEARCH_DESCRIPTION);
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

      actions.fetchBook(bookUrl)(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.FETCH_BOOK_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(actions.FETCH_BOOK_SUCCESS);
        expect(dispatch.mock.calls[2][0].type).toBe(actions.LOAD_BOOK);
        expect(data).toBe(testData);
        done();
      }).catch(err => done.fail(err));
    });

    it("dispatches failure", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = false;

      actions.fetchBook(bookUrl)(dispatch).catch(err => {
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.FETCH_BOOK_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(actions.FETCH_BOOK_FAILURE);
        expect(err).toBe("test error");
        done();
      });
    });
  });

});