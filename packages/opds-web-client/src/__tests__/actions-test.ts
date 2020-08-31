import { expect } from "chai";
import { stub } from "sinon";

import { SAML_AUTH_TYPE } from "./../utils/auth";
import {
  CollectionData,
  AuthProvider,
  ServerSamlMethod,
  ClientSamlMethod
} from "../interfaces";
const fetchMock = require("fetch-mock");
import ActionCreator from "../actions";
import MockDataFetcher from "../__mocks__/DataFetcher";
import DataFetcher from "../DataFetcher";

let testData = {
  lanes: [],
  books: [
    {
      id: "test id",
      url: "http://example.com/book",
      title: "test title"
    }
  ]
};

let mockFetcher = new MockDataFetcher();
let mockActions = new ActionCreator(mockFetcher);

let fetcher = new DataFetcher();
let actions = new ActionCreator(fetcher);

interface MockNumber {
  test: number;
}

describe("actions", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe("fetchBlob", () => {
    const type = "TEST";
    const url = "test url";

    it("dispatches request and success", async () => {
      const dispatch = stub();
      mockFetcher.resolve = true;
      mockFetcher.testData = { blob: () => "blob", ok: true };

      const data = await mockActions.fetchBlob(type, url)(dispatch);
      expect(dispatch.callCount).to.equal(2);
      // Only the request dispatch has the url
      expect(dispatch.args[0][0].type).to.equal(
        `${type}_${ActionCreator.REQUEST}`
      );
      expect(dispatch.args[0][0].url).to.equal(url);
      expect(dispatch.args[1][0].type).to.equal(
        `${type}_${ActionCreator.SUCCESS}`
      );
      expect(data).to.equal("blob");
    });

    it("dispatches failure on bad response", async () => {
      const dispatch = stub();
      mockFetcher.resolve = true;
      mockFetcher.testData = { ok: false, status: 500 };

      try {
        await mockActions.fetchBlob(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(
          `${type}_${ActionCreator.REQUEST}`
        );
        expect(dispatch.args[0][0].url).to.equal(url);
        expect(dispatch.args[1][0].type).to.equal(
          `${type}_${ActionCreator.FAILURE}`
        );
        const expectedError = {
          status: 500,
          response: `Response was not okay and was not retried (wasn't the result of a redirect).`,
          url: url
        };
        expect(dispatch.args[1][0].error).to.deep.equal(expectedError);
        expect(err).to.deep.equal(expectedError);
      }
    });

    it("dispatches failure on no response", async () => {
      let dispatch = stub();
      mockFetcher.resolve = false;

      try {
        await mockActions.fetchBlob(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(
          `${type}_${ActionCreator.REQUEST}`
        );
        expect(dispatch.args[0][0].url).to.equal(url);
        expect(dispatch.args[1][0].type).to.equal(
          `${type}_${ActionCreator.FAILURE}`
        );
        const expectedError = "test error";
        expect(dispatch.args[1][0].error).to.equal(expectedError);
        expect(err).to.equal(expectedError);
      }
    });
  });

  describe("fetchJSON", () => {
    const type = "TEST";
    const url = "test-url";

    it("dispatches request, load, and success", async () => {
      const dispatch = stub();
      const testData: MockNumber = { test: 1 };
      fetchMock.mock(url, { status: 200, body: testData });

      const data = await actions.fetchJSON<MockNumber>(type, url)(dispatch);

      // fetch tests
      expect(fetchMock.calls().length).to.equal(1);
      const fetchargs = fetchMock.calls();
      expect(fetchargs[0][0]).to.equal("/test-url");
      // dispatch tests
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(
        `${type}_${ActionCreator.REQUEST}`
      );
      expect(dispatch.args[0][0].url).to.equal(url);
      expect(dispatch.args[1][0].type).to.equal(
        `${type}_${ActionCreator.SUCCESS}`
      );
      expect(dispatch.args[2][0].type).to.equal(
        `${type}_${ActionCreator.LOAD}`
      );
      expect(dispatch.args[2][0].data).to.deep.equal(testData);
      expect(data).to.deep.equal(testData);
    });

    it("dispatches failure on non-json response", async () => {
      const dispatch = stub();
      fetchMock.mock(url, { status: 200, body: () => Promise.reject("nope") });

      try {
        await actions.fetchJSON<MockNumber>(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(
          `${type}_${ActionCreator.REQUEST}`
        );
        expect(dispatch.args[0][0].url).to.equal(url);
        expect(dispatch.args[1][0].type).to.equal(
          `${type}_${ActionCreator.FAILURE}`
        );
        const expectedError = {
          status: 200,
          response: "Non-json response",
          url: url
        };
        expect(dispatch.args[1][0].error).to.deep.equal(expectedError);
        expect(err).to.deep.equal(expectedError);
      }
    });

    it("dispatches failure on bad response with problem detail", async () => {
      const dispatch = stub();
      fetchMock.mock(url, {
        status: 500,
        body: () => Promise.reject({ detail: "detail" })
      });

      try {
        await actions.fetchJSON<MockNumber>(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(
          `${type}_${ActionCreator.REQUEST}`
        );
        expect(dispatch.args[1][0].type).to.equal(
          `${type}_${ActionCreator.FAILURE}`
        );
        const expectedError = {
          status: 500,
          response: "Request failed",
          url: url
        };
        expect(dispatch.args[1][0].error).to.deep.equal(expectedError);
        expect(err).to.deep.equal(expectedError);
      }
    });

    it("dispatches failure on bad response without problem detail", async () => {
      const dispatch = stub();
      fetchMock.mock(url, { status: 500, body: () => Promise.reject("") });

      try {
        await actions.fetchJSON<MockNumber>(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(
          `${type}_${ActionCreator.REQUEST}`
        );
        expect(dispatch.args[1][0].type).to.equal(
          `${type}_${ActionCreator.FAILURE}`
        );
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
      fetchMock.mock(url, () => Promise.reject({ message: "test error" }));

      try {
        await actions.fetchJSON<{ test: number }>(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(
          `${type}_${ActionCreator.REQUEST}`
        );
        expect(dispatch.args[1][0].type).to.equal(
          `${type}_${ActionCreator.FAILURE}`
        );
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
    const url = "/test-url";

    it("dispatches request, success, and load", async () => {
      const dispatch = stub();
      mockFetcher.resolve = true;
      mockFetcher.testData = testData;

      const data = await mockActions.fetchOPDS<CollectionData>(
        type,
        url
      )(dispatch);
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(
        `${type}_${ActionCreator.REQUEST}`
      );
      expect(dispatch.args[1][0].type).to.equal(
        `${type}_${ActionCreator.SUCCESS}`
      );
      expect(dispatch.args[2][0].type).to.equal(
        `${type}_${ActionCreator.LOAD}`
      );
      expect(data).to.deep.equal(testData);
    });

    it("dispatches failure on bad response", async () => {
      const dispatch = stub();
      mockFetcher.resolve = false;
      mockFetcher.testError = "test error";

      try {
        await mockActions.fetchOPDS<CollectionData>(type, url)(dispatch);
        // shouldn't get here
        expect(false).to.equal(true);
      } catch (err) {
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0].type).to.equal(
          `${type}_${ActionCreator.REQUEST}`
        );
        expect(dispatch.args[1][0].type).to.equal(
          `${type}_${ActionCreator.FAILURE}`
        );
        expect(dispatch.args[1][0].error).to.equal("test error");
        expect(err).to.equal("test error");
      }
    });
  });

  describe("request", () => {
    it("creates an action", () => {
      let type = "data type";
      let action = actions.request(type, "url");
      expect(action.type).to.equal(`${type}_${ActionCreator.REQUEST}`);
      expect(action.url).to.equal("url");
    });
  });

  describe("success", () => {
    it("creates an action", () => {
      let type = "data type";
      let action = actions.success(type);
      expect(action.type).to.equal(`${type}_${ActionCreator.SUCCESS}`);
    });
  });

  describe("failure", () => {
    it("creates an action", () => {
      let type = "data type";
      let err = { url: "url", response: "response", status: 400 };
      let action = actions.failure(type, err);
      expect(action.type).to.equal(`${type}_${ActionCreator.FAILURE}`);
      expect(action.error).to.eq(err);
    });
  });

  describe("load", () => {
    it("creates an action", () => {
      let type = "data type";
      let action = actions.load(type, 2);
      expect(action.type).to.equal(`${type}_${ActionCreator.LOAD}`);
      expect(action.data).to.equal(2);
    });
  });

  describe("clear", () => {
    it("creates an action", () => {
      let type = "data type";
      let action = actions.clear(type);
      expect(action.type).to.equal(`${type}_${ActionCreator.CLEAR}`);
    });
  });

  describe("fetchCollection", () => {
    it("dispatches request, load, and success", async () => {
      let dispatch = stub();
      mockFetcher.resolve = true;
      mockFetcher.testData = testData;

      const data = await mockActions.fetchCollection("http://example.com/feed")(
        dispatch
      );
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(
        ActionCreator.COLLECTION_REQUEST
      );
      expect(dispatch.args[1][0].type).to.equal(
        ActionCreator.COLLECTION_SUCCESS
      );
      expect(dispatch.args[2][0].type).to.equal(ActionCreator.COLLECTION_LOAD);
      expect(data).to.equal(testData);
    });
  });

  describe("fetchPage", () => {
    it("dispatches request, success, and load", async () => {
      let dispatch = stub();
      mockFetcher.resolve = true;
      mockFetcher.testData = testData;

      const data = await mockActions.fetchPage("http://example.com/feed")(
        dispatch
      );
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(ActionCreator.PAGE_REQUEST);
      expect(dispatch.args[1][0].type).to.equal(ActionCreator.PAGE_SUCCESS);
      expect(dispatch.args[2][0].type).to.equal(ActionCreator.PAGE_LOAD);
      expect(data).to.equal(testData);
    });
  });

  describe("fetchBook", () => {
    it("dispatches request, load, and success", async () => {
      let dispatch = stub();
      mockFetcher.resolve = true;
      mockFetcher.testData = testData;

      const data = await mockActions.fetchBook("http://example.com/book")(
        dispatch
      );
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(ActionCreator.BOOK_REQUEST);
      expect(dispatch.args[1][0].type).to.equal(ActionCreator.BOOK_SUCCESS);
      expect(dispatch.args[2][0].type).to.equal(ActionCreator.BOOK_LOAD);
      expect(data).to.equal(testData);
    });
  });

  describe("fetchSearchDescription", () => {
    it("dispatches load", async () => {
      let dispatch = stub();
      mockFetcher.resolve = true;
      mockFetcher.testData = testData;

      const data = await mockActions.fetchSearchDescription(
        "http://example.com/search"
      )(dispatch);
      expect(dispatch.callCount).to.equal(1);
      expect(dispatch.args[0][0].type).to.equal(
        ActionCreator.SEARCH_DESCRIPTION_LOAD
      );
      expect(data).to.equal(testData);
    });
  });

  describe("clearCollection", () => {
    it("creates an action", () => {
      let action = actions.clearCollection();
      expect(action.type).to.equal(
        `${ActionCreator.COLLECTION}_${ActionCreator.CLEAR}`
      );
    });
  });

  describe("closeError", () => {
    it("creates an action", () => {
      let action = actions.closeError();
      expect(action.type).to.equal(ActionCreator.CLOSE_ERROR);
    });
  });

  describe("loadBook", () => {
    it("creates an action", () => {
      let data = { id: "1", title: "title" };
      let action = actions.loadBook(data, "url");
      expect(action.type).to.equal(
        `${ActionCreator.BOOK}_${ActionCreator.LOAD}`
      );
      expect(action.data).to.eq(data);
      expect(action.url).to.equal("url");
    });
  });

  describe("clearBook", () => {
    it("creates an action", () => {
      let action = actions.clearBook();
      expect(action.type).to.equal(
        `${ActionCreator.BOOK}_${ActionCreator.CLEAR}`
      );
    });
  });

  describe("updateBook", () => {
    let borrowUrl = "http://example.com/book/borrow";
    let fulfillmentUrl = "http://example.com/book/fulfill";
    let mimeType = "mime/type";

    it("dispatches request, load, and success", async () => {
      let dispatch = stub();
      mockFetcher.resolve = true;
      mockFetcher.testData = { fulfillmentUrl, mimeType };

      const data = await mockActions.updateBook(borrowUrl)(dispatch);
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(
        ActionCreator.UPDATE_BOOK_REQUEST
      );
      expect(dispatch.args[1][0].type).to.equal(
        ActionCreator.UPDATE_BOOK_SUCCESS
      );
      expect(dispatch.args[2][0].type).to.equal(ActionCreator.UPDATE_BOOK_LOAD);
      expect(data).to.equal(mockFetcher.testData);
    });
  });

  describe("fulfillBook", () => {
    let fulfillmentUrl = "http://example.com/book/fulfill";

    it("dispatches request, load, and success", async () => {
      let dispatch = stub();
      mockFetcher.resolve = true;
      mockFetcher.testData = { blob: () => "blob", ok: true };

      const data = await mockActions.fulfillBook(fulfillmentUrl)(dispatch);
      expect(dispatch.callCount).to.equal(2);
      expect(dispatch.args[0][0].type).to.equal(
        ActionCreator.FULFILL_BOOK_REQUEST
      );
      expect(dispatch.args[1][0].type).to.equal(
        ActionCreator.FULFILL_BOOK_SUCCESS
      );
      expect(data).to.equal("blob");
    });
  });

  describe("indirectFulfillBook", () => {
    let fulfillmentUrl = "http://example.com/book/fulfill";
    let fulfillmentType =
      "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";
    let indirectUrl = "http://example.com/reader";

    it("dispatches request, load, and success", async () => {
      let dispatch = stub();
      mockFetcher.resolve = true;
      mockFetcher.testData = {
        fulfillmentLinks: [{ url: indirectUrl, type: fulfillmentType }]
      };

      const url = await mockActions.indirectFulfillBook(
        fulfillmentUrl,
        fulfillmentType
      )(dispatch);
      expect(dispatch.callCount).to.equal(2);
      expect(dispatch.args[0][0].type).to.equal(
        ActionCreator.FULFILL_BOOK_REQUEST
      );
      expect(dispatch.args[1][0].type).to.equal(
        ActionCreator.FULFILL_BOOK_SUCCESS
      );
      expect(url).to.equal(indirectUrl);
    });
  });

  describe("fetchLoans", () => {
    let loansUrl = "http://example.com/loans";

    it("dispatches request, load, and success", async () => {
      let dispatch = stub();
      mockFetcher.resolve = true;
      mockFetcher.testData = testData;

      const data = await mockActions.fetchLoans(loansUrl)(dispatch);
      expect(dispatch.callCount).to.equal(3);
      expect(dispatch.args[0][0].type).to.equal(ActionCreator.LOANS_REQUEST);
      expect(dispatch.args[1][0].type).to.equal(ActionCreator.LOANS_SUCCESS);
      expect(dispatch.args[2][0].type).to.equal(ActionCreator.LOANS_LOAD);
      expect(data).to.equal(testData);
    });
  });

  describe("showAuthForm", () => {
    it("creates an action", () => {
      let callback = stub();
      let cancel = stub();
      let providers = [];
      let action = actions.showAuthForm(callback, cancel, providers, "title");
      expect(action.type).to.equal(ActionCreator.SHOW_AUTH_FORM);
      expect(action.callback).to.equal(callback);
      expect(action.cancel).to.equal(cancel);
      expect(action.providers).to.deep.equal(providers);
    });

    it("flattens server saml providers", () => {
      let callback = stub();
      let cancel = stub();
      const samlPlugin = {
        type: "saml-type",
        lookForCredentials: stub(),
        buttonComponent: () => null
      };
      let serverSamlProvider: AuthProvider<ServerSamlMethod> = {
        id: SAML_AUTH_TYPE,
        plugin: samlPlugin,
        method: {
          type: SAML_AUTH_TYPE,
          links: [
            {
              privacy_statement_urls: [],
              logo_urls: [],
              display_names: [{ language: "en", value: "Saml Idp 1" }],
              href: "/saml-href-1",
              rel: "authenticate",
              descriptions: [{ language: "en", value: "Some description" }],
              information_urls: []
            },
            {
              privacy_statement_urls: [],
              logo_urls: [],
              display_names: [{ language: "en", value: "Saml Idp 2" }],
              href: "/saml-href-2",
              rel: "authenticate",
              descriptions: [{ language: "en", value: "Some description" }],
              information_urls: []
            }
          ]
        }
      };
      let providers = [serverSamlProvider];
      let action = actions.showAuthForm(callback, cancel, providers, "title");
      expect(action.type).to.equal(ActionCreator.SHOW_AUTH_FORM);
      expect(action.callback).to.equal(callback);
      expect(action.cancel).to.equal(cancel);
      const expectedProviders: AuthProvider<ClientSamlMethod>[] = [
        {
          id: "/saml-href-1",
          plugin: samlPlugin,
          method: {
            href: "/saml-href-1",
            description: "Saml Idp 1",
            type: SAML_AUTH_TYPE
          }
        },
        {
          id: "/saml-href-2",
          plugin: samlPlugin,
          method: {
            href: "/saml-href-2",
            description: "Saml Idp 2",
            type: SAML_AUTH_TYPE
          }
        }
      ];
      console.log(action.providers);
      expect(action.providers).to.deep.equal(expectedProviders);
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

  describe("hideAuthForm", () => {
    it("creates an action", () => {
      let action = actions.hideAuthForm();
      expect(action.type).to.equal(ActionCreator.HIDE_AUTH_FORM);
    });
  });

  describe("saveAuthCredentials", () => {
    it("sets fetcher credentials", () => {
      let credentials = { provider: "test", credentials: "credentials" };
      fetcher.setAuthCredentials = stub();
      actions.saveAuthCredentials(credentials);
      expect((fetcher.setAuthCredentials as any).callCount).to.equal(1);
      expect((fetcher.setAuthCredentials as any).args[0][0]).to.deep.equal(
        credentials
      );
    });
  });

  describe("clearAuthCredentials", () => {
    it("clears fetcher credentials", () => {
      fetcher.clearAuthCredentials = stub();
      actions.clearAuthCredentials();
      expect((fetcher.clearAuthCredentials as any).callCount).to.equal(1);
    });
  });

  describe("setPreference", () => {
    it("creates an action", () => {
      let action = actions.setPreference("key", "value");
      expect(action.type).to.equal(ActionCreator.SET_PREFERENCE);
      expect(action.key).to.equal("key");
      expect(action.value).to.equal("value");
    });
  });
});
