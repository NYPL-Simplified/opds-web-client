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
let fetcher = new DataFetcher() as any;
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
      }).catch(done.fail);
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
      }).catch(done.fail);
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
      }).catch(done.fail);
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
      }).catch(done.fail);
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

  describe("borrowBook", () => {
    let borrowUrl = "http://example.com/book/borrow";
    let fulfillmentUrl = "http://example.com/book/fulfill";
    let mimeType = "mime/type";

    it("dispatches request, load, and success", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = true;
      fetcher.testData = { fulfillmentUrl, mimeType };

      actions.borrowBook(borrowUrl)(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.BORROW_BOOK_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(actions.BORROW_BOOK_SUCCESS);
        expect(dispatch.mock.calls[2][0].type).toBe(actions.LOAD_BORROW_DATA);
        expect(data).toEqual(fetcher.testData);
        done();
      }).catch(done.fail);
    });

    it("dispatches failure", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = false;

      actions.borrowBook(borrowUrl)(dispatch).catch(err => {
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.BORROW_BOOK_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(actions.BORROW_BOOK_FAILURE);
        expect(err).toBe("test error");
        done();
      });
    });
  });

  describe("fulfillBook", () => {
    let fulfillmentUrl = "http://example.com/book/fulfill";

    it("dispatches request, load, and success", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = true;
      fetcher.testData = { blob: () => "blob" };

      actions.fulfillBook(fulfillmentUrl)(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.FULFILL_BOOK_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(actions.FULFILL_BOOK_SUCCESS);
        expect(data).toBe("blob");
        done();
      }).catch(done.fail);
    });

    it("dispatches failure", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = false;

      actions.fulfillBook(fulfillmentUrl)(dispatch).catch(err => {
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.FULFILL_BOOK_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(actions.FULFILL_BOOK_FAILURE);
        expect(err).toBe("test error");
        done();
      });
    });
  });

  describe("fetchLoans", () => {
    let loansUrl = "http://example.com/loans";

    it("dispatches request, load, and success", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = true;
      fetcher.testData = testData;

      actions.fetchLoans(loansUrl)(dispatch).then(data => {
        expect(dispatch.mock.calls.length).toBe(3);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.FETCH_LOANS_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(actions.FETCH_LOANS_SUCCESS);
        expect(dispatch.mock.calls[2][0].type).toBe(actions.LOAD_LOANS);
        expect(data).toBe(testData);
        done();
      }).catch(done.fail);
    });

    it("dispatches failure", (done) => {
      let dispatch = jest.genMockFunction();
      fetcher.resolve = false;

      actions.fetchLoans(loansUrl)(dispatch).catch(err => {
        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0].type).toBe(actions.FETCH_LOANS_REQUEST);
        expect(dispatch.mock.calls[1][0].type).toBe(actions.FETCH_LOANS_FAILURE);
        expect(err).toBe("test error");
        done();
      });
    });
  });

  describe("closeErrorAndHideBasicAuthForm", () => {
    it("closes error message", () => {
      let dispatch = jest.genMockFunction();
      actions.closeErrorAndHideBasicAuthForm()(dispatch);
      expect(dispatch.mock.calls.length).toBe(2);
      expect(dispatch.mock.calls[0][0].type).toBe(actions.CLOSE_ERROR);
      expect(dispatch.mock.calls[1][0].type).toBe(actions.HIDE_BASIC_AUTH_FORM);
    });
  });

  describe("saveBasicAuthCredentials", () => {
    it("sets fetcher credentaials", () => {
      fetcher.setBasicAuthCredentials = jest.genMockFunction();
      actions.saveBasicAuthCredentials("credentials");
      expect(fetcher.setBasicAuthCredentials.mock.calls.length).toBe(1);
      expect(fetcher.setBasicAuthCredentials.mock.calls[0][0]).toBe("credentials");
    });
  });

  describe("clearBasicAuthCredentials", () => {
    it("clears fetcher credentaials", () => {
      fetcher.clearBasicAuthCredentials = jest.genMockFunction();
      actions.clearBasicAuthCredentials();
      expect(fetcher.clearBasicAuthCredentials.mock.calls.length).toBe(1);
    });
  });
});