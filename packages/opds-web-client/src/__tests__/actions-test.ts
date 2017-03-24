import { expect } from "chai";
import { stub } from "sinon";

import { CollectionData } from "../interfaces";

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

import ActionCreator from "../actions";
let actions = new ActionCreator(fetcher);

describe("actions", () => {
  describe("fetchBlob", () => {
    const type = "TEST";
    const url = "test url";

    it("dispatches request and success", async () => {
      const dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = { blob: () => "blob", ok: true };

      const data = await actions.fetchBlob(type, url)(dispatch);
      expect(dispatch.callCount).to.equal(2);
      expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
      expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.SUCCESS}`);
      expect(data).to.equal("blob");
    });

    it("dispatches failure on bad response", async () => {
      const dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = { ok: false, status: 500 };

      try {
        await actions.fetchBlob(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
        expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.FAILURE}`);
        const expectedError = {
          status: 500,
          response: "Request failed",
          url: url
        };
        expect(dispatch.args[1][0].error).to.deep.equal(expectedError);
        expect(err).to.deep.equal(expectedError);
      }
    });

    it("dispatches failure on no response", async () => {
      let dispatch = stub();
      fetcher.resolve = false;

      try {
        await actions.fetchBlob(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
        expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.FAILURE}`);
        const expectedError = "test error";
        expect(dispatch.args[1][0].error).to.equal(expectedError);
        expect(err).to.equal(expectedError);
      }
    });
  });

  describe("fetchJSON", () => {
    const type = "TEST";
    const url = "test url";

    it("dispatches request, load, and success", async () => {
      const dispatch = stub();
      fetcher.resolve = true;
      const jsonResponse = new Promise<{ test: number }>(resolve => resolve({ test : 1 }));
      fetcher.testData = { json: () => jsonResponse, ok: true };

      const data = await actions.fetchJSON<{ test: number }>(type, url)(dispatch);
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
      expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.SUCCESS}`);
      expect(dispatch.args[2][0].type).to.equal(`${type}_${ActionCreator.LOAD}`);
      expect(dispatch.args[2][0].data).to.deep.equal({ test: 1 });
      expect(data).to.deep.equal({ test: 1 });
    });

    it("dispatches failure on non-json response", async () => {
      const dispatch = stub();
      fetcher.resolve = true;
      const jsonResponse = new Promise<{ test: number }>((_, reject) => reject());
      fetcher.testData = { json: () => jsonResponse, ok: true };

      try {
        await actions.fetchJSON<{ test: number }>(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
        expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.FAILURE}`);
      }
    });

    it("dispatches failure on bad response with problem detail", async () => {
      const dispatch = stub();
      fetcher.resolve = true;
      const problemDetail = new Promise<{ detail: string }>(resolve => resolve({ detail : "detail" }));
      fetcher.testData = { ok: false, status: 500,  json: () => problemDetail };

      try {
        await actions.fetchJSON<{ test: number }>(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
        expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.FAILURE}`);
        const expectedError = {
          status: 500,
          response: "detail",
          url: url
        };
        expect(dispatch.args[1][0].error).to.deep.equal(expectedError);
        expect(err).to.deep.equal(expectedError);
      }
    });

    it("dispatches failure on bad response without problem detail", async () => {
      const dispatch = stub();
      fetcher.resolve = true;
      const notAProblemDetail = new Promise<{ detail: string }>((_, reject) => reject());
      fetcher.testData = { ok: false, status: 500,  json: () => notAProblemDetail };

      try {
        await actions.fetchJSON<{ test: number }>(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
        expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.FAILURE}`);
        const expectedError = {
          status: 500,
          response: "Request failed",
          url: url
        };
        expect(dispatch.args[1][0].error).to.deep.equal(expectedError);
        expect(err).to.deep.equal(expectedError);
      }
    });

    it("dispatches failure on no response", async () => {
      let dispatch = stub();
      fetcher.resolve = false;
      fetcher.testError = { message : "test error" };

      try {
        await actions.fetchJSON<{ test: number }>(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
        expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.FAILURE}`);
        const expectedError = {
          status: null,
          response: "test error",
          url: url
        };
        expect(dispatch.args[1][0].error).to.deep.equal(expectedError);
        expect(err).to.deep.equal(expectedError);
      }
    });
  });

  describe("fetchOPDS", () => {
    const type = "TEST";
    const url = "test url";

    it("dispatches request, success, and load", async () => {
      const dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = testData;

      const data = await actions.fetchOPDS<CollectionData>(type, url)(dispatch);
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
      expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.SUCCESS}`);
      expect(dispatch.args[2][0].type).to.equal(`${type}_${ActionCreator.LOAD}`);
      expect(data).to.deep.equal(testData);
    });

    it("dispatches failure on bad response", async () => {
      const dispatch = stub();
      fetcher.resolve = false;
      fetcher.testError = "test error";

      try {
        await actions.fetchOPDS<CollectionData>(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(`${type}_${ActionCreator.REQUEST}`);
        expect(dispatch.args[1][0].type).to.equal(`${type}_${ActionCreator.FAILURE}`);
        expect(dispatch.args[1][0].error).to.equal("test error");
        expect(err).to.equal("test error");
      }
    });
  });

  describe("fetchCollection", () => {
    it("dispatches request, load, and success", async () => {
      let dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = testData;

      const data = await actions.fetchCollection("http://example.com/feed")(dispatch);
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(ActionCreator.COLLECTION_REQUEST);
      expect(dispatch.args[1][0].type).to.equal(ActionCreator.COLLECTION_SUCCESS);
      expect(dispatch.args[2][0].type).to.equal(ActionCreator.COLLECTION_LOAD);
      expect(data).to.equal(testData);
    });
  });

  describe("fetchPage", () => {
    it("dispatches request, success, and load", async () => {
      let dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = testData;

      const data = await actions.fetchPage("http://example.com/feed")(dispatch);
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(ActionCreator.PAGE_REQUEST);
      expect(dispatch.args[1][0].type).to.equal(ActionCreator.PAGE_SUCCESS);
      expect(dispatch.args[2][0].type).to.equal(ActionCreator.PAGE_LOAD);
      expect(data).to.equal(testData);
    });
  });

  describe("fetchSearchDescription", () => {
    it("dispatches load", async () => {
      let dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = testData;

      const data = await actions.fetchSearchDescription("http://example.com/search")(dispatch);
      expect(dispatch.callCount).to.equal(1);
      expect(dispatch.args[0][0].type).to.equal(ActionCreator.SEARCH_DESCRIPTION_LOAD);
      expect(data).to.equal(testData);
    });
  });

  describe("fetchBook", () => {
    it("dispatches request, load, and success", async () => {
      let dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = testData;

      const data = await actions.fetchBook("http://example.com/book")(dispatch);
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(ActionCreator.BOOK_REQUEST);
      expect(dispatch.args[1][0].type).to.equal(ActionCreator.BOOK_SUCCESS);
      expect(dispatch.args[2][0].type).to.equal(ActionCreator.BOOK_LOAD);
      expect(data).to.equal(testData);
    });
  });

  describe("updateBook", () => {
    let borrowUrl = "http://example.com/book/borrow";
    let fulfillmentUrl = "http://example.com/book/fulfill";
    let mimeType = "mime/type";

    it("dispatches request, load, and success", async () => {
      let dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = { fulfillmentUrl, mimeType };

      const data = await actions.updateBook(borrowUrl)(dispatch);
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(ActionCreator.UPDATE_BOOK_REQUEST);
      expect(dispatch.args[1][0].type).to.equal(ActionCreator.UPDATE_BOOK_SUCCESS);
      expect(dispatch.args[2][0].type).to.equal(ActionCreator.UPDATE_BOOK_LOAD);
      expect(data).to.equal(fetcher.testData);
    });
  });

  describe("fulfillBook", () => {
    let fulfillmentUrl = "http://example.com/book/fulfill";

    it("dispatches request, load, and success", async () => {
      let dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = { blob: () => "blob", ok: true };

      const data = await actions.fulfillBook(fulfillmentUrl)(dispatch);
      expect(dispatch.callCount).to.equal(2);
      expect(dispatch.args[0][0].type).to.equal(ActionCreator.FULFILL_BOOK_REQUEST);
      expect(dispatch.args[1][0].type).to.equal(ActionCreator.FULFILL_BOOK_SUCCESS);
      expect(data).to.equal("blob");
    });
  });

  describe("indirectFulfillBook", () => {
    let fulfillmentUrl = "http://example.com/book/fulfill";
    let fulfillmentType = "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";
    let indirectUrl = "http://example.com/reader";

    it("dispatches request, load, and success", async () => {
      let dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = {
        fulfillmentLinks: [
          { url: indirectUrl, type: fulfillmentType }
        ]
      };

      const url = await actions.indirectFulfillBook(fulfillmentUrl, fulfillmentType)(dispatch);
      expect(dispatch.callCount).to.equal(2);
      expect(dispatch.args[0][0].type).to.equal(ActionCreator.FULFILL_BOOK_REQUEST);
      expect(dispatch.args[1][0].type).to.equal(ActionCreator.FULFILL_BOOK_SUCCESS);
      expect(url).to.equal(indirectUrl);
    });
  });

  describe("fetchLoans", () => {
    let loansUrl = "http://example.com/loans";

    it("dispatches request, load, and success", async () => {
      let dispatch = stub();
      fetcher.resolve = true;
      fetcher.testData = testData;

      const data = await actions.fetchLoans(loansUrl)(dispatch);
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(ActionCreator.LOANS_REQUEST);
      expect(dispatch.args[1][0].type).to.equal(ActionCreator.LOANS_SUCCESS);
      expect(dispatch.args[2][0].type).to.equal(ActionCreator.LOANS_LOAD);
      expect(data).to.equal(testData);
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