import { expect } from "chai";
import { stub } from "sinon";
const fetchMock = require("fetch-mock");

import DataFetcher from "../DataFetcher";
const Cookie = require("js-cookie");

describe("DataFetcher", () => {
  const adapter = (data, url) => "adapter";
  describe("fetch()", () => {
    beforeEach(() => {
      fetchMock.mock("test-url", 200).mock("http://example.com", 200);
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it("uses fetch()", () => {
      let options = {
        method: "POST",
        data: { test: "test" },
        credentials: "same-origin"
      };
      let fetcher = new DataFetcher({ adapter });
      fetcher.fetch("test-url", options);
      let fetchArgs = fetchMock.calls();

      expect(fetchMock.called()).to.equal(true);
      expect(fetchArgs[0][0]).to.equal("/test-url");
      expect(fetchArgs[0][1]).to.deep.equal({
        ...options,
        headers: { "X-Requested-With": "XMLHttpRequest", Authorization: "" }
      });
    });

    it("sends credentials by default", () => {
      let options = {
        method: "POST",
        data: { test: "test" }
      };
      let fetcher = new DataFetcher({ adapter });
      fetcher.fetch("test-url", options);
      let fetchArgs = fetchMock.calls();

      expect(fetchMock.called()).to.equal(true);
      expect(fetchArgs[0][0]).to.equal("/test-url");
      expect(fetchArgs[0][1]).to.deep.equal({
        credentials: "same-origin",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: ""
        },
        ...options
      });
    });

    it("uses proxy url if provided", () => {
      class MockFormData {
        data: any;

        constructor() {
          this.data = {};
        }

        append(key, val) {
          this.data[key] = val;
        }

        get(key) {
          return { value: this.data[key] };
        }

        apply() {
          return;
        }
      }

      let formDataStub = stub(window, "FormData").callsFake(
        () => new MockFormData()
      );

      let proxyUrl = "http://example.com";
      let fetcher = new DataFetcher({ proxyUrl, adapter });
      fetcher.fetch("test-url");
      let fetchArgs = fetchMock.calls();

      expect(fetchMock.called()).to.equal(true);
      expect(fetchArgs[0][0]).to.equal(`${proxyUrl}/`);
      expect(fetchArgs[0][1].method).to.equal("POST");
      expect(fetchArgs[0][1].body.get("url").value).to.equal("test-url");

      formDataStub.restore();
    });

    it("prepares auth headers", () => {
      let fetcher = new DataFetcher({ adapter });
      let credentials = { provider: "test", credentials: "credentials" };
      fetcher.getAuthCredentials = () => credentials;
      fetcher.fetch("test-url");
      let fetchArgs = fetchMock.calls();
      expect(fetchArgs[0][1].headers["Authorization"]).to.equal("credentials");
    });
  });

  describe("Auth Credentials", () => {
    it("doesn't set auth credentials if there are none", () => {
      let fetcher = new DataFetcher({ adapter });
      fetcher.setAuthCredentials(undefined);
      expect(Cookie.get(fetcher.authKey)).to.deep.equal(undefined);
    });

    it("sets auth credentials", () => {
      let fetcher = new DataFetcher({ adapter });
      let credentials = { provider: "test", credentials: "credentials" };
      fetcher.setAuthCredentials(credentials);
      expect(Cookie.get(fetcher.authKey)).to.deep.equal(
        JSON.stringify(credentials)
      );
    });

    it("gets auth credentials", () => {
      let fetcher = new DataFetcher({ adapter });
      let credentials = { provider: "test", credentials: "credentials" };
      Cookie.set(fetcher.authKey, JSON.stringify(credentials));
      expect(fetcher.getAuthCredentials()).to.deep.equal(credentials);
    });

    it("clears auth credentials", () => {
      let fetcher = new DataFetcher({ adapter });
      let credentials = { provider: "test", credentials: "credentials" };
      Cookie.set(fetcher.authKey, JSON.stringify(credentials));
      fetcher.clearAuthCredentials();
      expect(Cookie.get(fetcher.authKey)).to.equal(undefined);
    });
  });

  describe("fetchOPDSData()", () => {
    it("rejects and returns an error if the adapter isn't configured", async () => {
      let fetcher = new DataFetcher();

      // No need to mock a fetch response since it should not reach that point.
      await fetcher.fetchOPDSData("test-url").catch(err => {
        expect(err.status).to.equal(null);
        expect(err.response).to.equal(
          "No adapter has been configured in DataFetcher."
        );
        expect(err.url).to.equal("test-url");
      });
    });

    it("throws error if response isn't 200", async () => {
      fetchMock.mock("test-url", { status: 401, body: "unauthorized" });

      let fetcher = new DataFetcher({ adapter });
      await fetcher.fetchOPDSData("test-url").catch(err => {
        expect(err.status).to.equal(401);
        expect(err.response).to.equal("unauthorized");
        expect(err.url).to.equal("test-url");
      });

      fetchMock.restore();
    });

    it("throws an error if the response is not OPDS", async () => {
      fetchMock.mock("test-url", { status: 200, body: "not OPDS" });

      let fetcher = new DataFetcher({ adapter });
      await fetcher.fetchOPDSData("test-url").catch(err => {
        expect(err.status).to.equal(null);
        expect(err.response).to.equal("Failed to parse OPDS data");
        expect(err.url).to.equal("test-url");
      });

      fetchMock.restore();
    });

    it("throws an error on a bad call", async () => {
      fetchMock.mock("test-url", { status: 500, body: "nope" });

      let fetcher = new DataFetcher({ adapter });
      await fetcher.fetchOPDSData("test-url").catch(err => {
        expect(err.response).to.equal("nope");
      });

      fetchMock.restore();
    });
  });
});
