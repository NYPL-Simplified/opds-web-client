import { expect } from "chai";
import { stub } from "sinon";

let testData = {
  lanes: [],
  books: [{
    id: "test id",
    url: "http://example.com/book",
    title: "test title"
  }]
};

import DataFetcher from "../__mocks__/DataFetcher";
let fetcher = new DataFetcher();
fetcher.testData = testData;

import ActionCreator from "../actions";
let actions = new ActionCreator(fetcher);

describe("actions", () => {
  describe("fetchCollection", () => {
    let collectionUrl = "http://example.com/feed";

    it("dispatches request, load, and success", (done) => {
      let dispatch = stub();
      fetcher.resolve = true;

      actions.fetchCollection(collectionUrl)(dispatch).then(data => {
        expect(dispatch.callCount).to.equal(3);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.COLLECTION_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.COLLECTION_SUCCESS);
        expect(dispatch.args[2][0].type).to.equal(ActionCreator.COLLECTION_LOAD);
        expect(data).to.equal(testData);
        done();
      }).catch(err => { console.log(err); throw(err); });
    });

    it("dispatches failure", (done) => {
      let dispatch = stub();
      fetcher.resolve = false;

      actions.fetchCollection(collectionUrl)(dispatch).catch(err => {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.COLLECTION_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.COLLECTION_FAILURE);
        expect(err).to.equal("test error");
        done();
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("fetchPage", () => {

    it("dispatches request, success, and load", (done) => {
      let dispatch = stub();
      fetcher.resolve = true;

      actions.fetchPage("http://example.com/feed")(dispatch).then(data => {
        expect(dispatch.callCount).to.equal(3);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.PAGE_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.PAGE_SUCCESS);
        expect(dispatch.args[2][0].type).to.equal(ActionCreator.PAGE_LOAD);
        expect(data).to.equal(testData);
        done();
      }).catch(err => { console.log(err); throw(err); });
    });

    it("dispatches failure", (done) => {
      let dispatch = stub();
      fetcher.resolve = false;

      actions.fetchPage("http://example.com/feed")(dispatch).catch(err => {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.PAGE_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.PAGE_FAILURE);
        expect(err).to.equal("test error");
        done();
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("fetchSearchDescription", () => {
    it("dispatches load", (done) => {
      let dispatch = stub();
      fetcher.resolve = true;

      actions.fetchSearchDescription("http://example.com/search")(dispatch).then(data => {
        expect(dispatch.callCount).to.equal(1);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.SEARCH_DESCRIPTION_LOAD);
        expect(data).to.equal(testData);
        done();
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("fetchBook", () => {
    let bookUrl = "http://example.com/book";

    it("dispatches request, load, and success", (done) => {
      let dispatch = stub();
      fetcher.resolve = true;

      actions.fetchBook(bookUrl)(dispatch).then(data => {
        expect(dispatch.callCount).to.equal(3);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.BOOK_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.BOOK_SUCCESS);
        expect(dispatch.args[2][0].type).to.equal(ActionCreator.BOOK_LOAD);
        expect(data).to.equal(testData);
        done();
      }).catch(err => { console.log(err); throw(err); });
    });

    it("dispatches failure", (done) => {
      let dispatch = stub();
      fetcher.resolve = false;

      actions.fetchBook(bookUrl)(dispatch).catch(err => {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.BOOK_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.BOOK_FAILURE);
        expect(err).to.equal("test error");
        done();
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("updateBook", () => {
    let borrowUrl = "http://example.com/book/borrow";
    let fulfillmentUrl = "http://example.com/book/fulfill";
    let mimeType = "mime/type";

    it("dispatches request, load, and success", (done) => {
      let dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = { fulfillmentUrl, mimeType };

      actions.updateBook(borrowUrl)(dispatch).then(data => {
        expect(dispatch.callCount).to.equal(3);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.UPDATE_BOOK_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.UPDATE_BOOK_SUCCESS);
        expect(dispatch.args[2][0].type).to.equal(ActionCreator.UPDATE_BOOK_LOAD);
        expect(data).to.equal(fetcher.testData);
        done();
      }).catch(err => { console.log(err); throw(err); });
    });

    it("dispatches failure", (done) => {
      let dispatch = stub();
      fetcher.resolve = false;

      actions.updateBook(borrowUrl)(dispatch).catch(err => {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.UPDATE_BOOK_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.UPDATE_BOOK_FAILURE);
        expect(err).to.equal("test error");
        done();
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("fulfillBook", () => {
    let fulfillmentUrl = "http://example.com/book/fulfill";

    it("dispatches request, load, and success", (done) => {
      let dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = { blob: () => "blob", ok: true };

      actions.fulfillBook(fulfillmentUrl)(dispatch).then(data => {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.FULFILL_BOOK_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.FULFILL_BOOK_SUCCESS);
        expect(data).to.equal("blob");
        done();
      }).catch(err => { console.log(err); throw(err); });
    });

    it("dispatches failure", (done) => {
      let dispatch = stub();
      fetcher.resolve = false;

      actions.fulfillBook(fulfillmentUrl)(dispatch).catch(err => {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.FULFILL_BOOK_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.FULFILL_BOOK_FAILURE);
        expect(err).to.equal("test error");
        done();
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("indirectFulfillBook", () => {
    let fulfillmentUrl = "http://example.com/book/fulfill";
    let fulfillmentType = "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";
    let indirectUrl = "http://example.com/reader";

    it("dispatches request, load, and success", (done) => {
      let dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = {
        fulfillmentLinks: [
          { url: indirectUrl, type: fulfillmentType }
        ]
      };

      actions.indirectFulfillBook(fulfillmentUrl, fulfillmentType)(dispatch).then(url => {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.FULFILL_BOOK_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.FULFILL_BOOK_SUCCESS);
        expect(url).to.equal(indirectUrl);
        done();
      }).catch(err => { console.log(err); throw(err); });
    });

    it("dispatches failure", (done) => {
      let dispatch = stub();
      fetcher.resolve = false;

      actions.indirectFulfillBook(fulfillmentUrl, fulfillmentType)(dispatch).catch(err => {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.FULFILL_BOOK_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.FULFILL_BOOK_FAILURE);
        expect(err).to.equal("test error");
        done();
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("fetchLoans", () => {
    let loansUrl = "http://example.com/loans";

    it("dispatches request, load, and success", (done) => {
      let dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = testData;

      actions.fetchLoans(loansUrl)(dispatch).then(data => {
        expect(dispatch.callCount).to.equal(3);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.LOANS_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.LOANS_SUCCESS);
        expect(dispatch.args[2][0].type).to.equal(ActionCreator.LOANS_LOAD);
        expect(data).to.equal(testData);
        done();
      }).catch(err => { console.log(err); throw(err); });
    });

    it("dispatches failure", (done) => {
      let dispatch = stub();
      fetcher.resolve = false;

      actions.fetchLoans(loansUrl)(dispatch).catch(err => {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(ActionCreator.LOANS_REQUEST);
        expect(dispatch.args[1][0].type).to.equal(ActionCreator.LOANS_FAILURE);
        expect(err).to.equal("test error");
        done();
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("closeErrorAndHideAuthForm", () => {
    it("closes error message", () => {
      let dispatch = stub();
      actions.closeErrorAndHideAuthForm()(dispatch);
      expect(dispatch.callCount).to.equal(2);
      expect(dispatch.args[0][0].type).to.equal(ActionCreator.CLOSE_ERROR);
      expect(dispatch.args[1][0].type).to.equal(ActionCreator.HIDE_AUTH_FORM);
    });
  });

  describe("saveAuthCredentials", () => {
    it("sets fetcher credentials", () => {
      let credentials = { provider: "test", credentials: "credentials" };
      actions.saveAuthCredentials(credentials);
      expect((fetcher.setAuthCredentials as any).callCount).to.equal(1);
      expect((fetcher.setAuthCredentials as any).args[0][0]).to.deep.equal(credentials);
    });
  });

  describe("clearAuthCredentials", () => {
    it("clears fetcher credentials", () => {
      fetcher.clearAuthCredentials = stub();
      actions.clearAuthCredentials();
      expect((fetcher.clearAuthCredentials as any).callCount).to.equal(1);
    });
  });
});