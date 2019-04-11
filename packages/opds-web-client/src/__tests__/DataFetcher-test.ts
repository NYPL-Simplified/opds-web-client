import { expect } from "chai";
import { stub } from "sinon";

import DataFetcher from "../DataFetcher";
const Cookie = require("js-cookie");
require("isomorphic-fetch");

describe.only("DataFetcher", () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = stub().returns(new Promise<any>((resolve, reject) => {
      resolve({ status: 200 });
    }));
    window.fetch = mockFetch;
  });

  it("uses fetch()", () => {
    let options = {
      method: "POST",
      data: { test: "test" },
      credentials: "same-origin"
    };
    let fetcher = new DataFetcher();
    fetcher.fetch("test url", options);

    expect(mockFetch.callCount).to.equal(1);
    expect(mockFetch.args[0][0]).to.equal("test url");
    expect(mockFetch.args[0][1]).to.deep.equal(Object.assign({}, options, {
      headers: { "X-Requested-With": "XMLHttpRequest" }
    }));
  });

  it("sends credentials by default", () => {
    let options = {
      method: "POST",
      data: { test: "test" }
    };
    let fetcher = new DataFetcher();
    fetcher.fetch("test url", options);

    expect(mockFetch.callCount).to.equal(1);
    expect(mockFetch.args[0][0]).to.equal("test url");
    expect(mockFetch.args[0][1]).to.deep.equal(
      Object.assign({ credentials: "same-origin", headers: {
        "X-Requested-With": "XMLHttpRequest"
      } }, options)
    );
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
    }

    let formDataStub = stub(window, "FormData").callsFake(MockFormData);

    let proxyUrl = "http://example.com";
    let fetcher = new DataFetcher({ proxyUrl });
    fetcher.fetch("test url");

    expect(mockFetch.callCount).to.equal(1);
    expect(mockFetch.args[0][0]).to.equal(proxyUrl);
    expect(mockFetch.args[0][1].method).to.equal("POST");
    expect(mockFetch.args[0][1].body.get("url").value).to.equal("test url");
  });

  it("prepares auth headers", () => {
    let fetcher = new DataFetcher();
    let credentials = { provider: "test", credentials: "credentials" };
    fetcher.getAuthCredentials = () => credentials;
    fetcher.fetch("test url");
    expect(mockFetch.args[0][1].headers["Authorization"]).to.equal("credentials");
  });

  it("sets auth credentials", () => {
    let fetcher = new DataFetcher();
    let credentials = { provider: "test", credentials: "credentials" };
    fetcher.setAuthCredentials(credentials);
    expect(Cookie.get(fetcher.authKey)).to.deep.equal(JSON.stringify(credentials));
  });

  it("gets auth credentials", () => {
    let fetcher = new DataFetcher();
    let credentials = { provider: "test", credentials: "credentials" };
    Cookie.set(fetcher.authKey, JSON.stringify(credentials));
    expect(fetcher.getAuthCredentials()).to.deep.equal(credentials);
  });

  it("clears auth credentials", () => {
    let fetcher = new DataFetcher();
    let credentials = { provider: "test", credentials: "credentials" };
    Cookie.set(fetcher.authKey, JSON.stringify(credentials));
    fetcher.clearAuthCredentials();
    expect(Cookie.get(fetcher.authKey)).to.equal(undefined);
  });

  describe("fetchOPDSData()", () => {
    it("throws error if response isn't 200", () => {
      mockFetch = stub().returns(new Promise<any>((resolve, reject) => {
        resolve({
          status: 401,
          text: () => new Promise((resolve, reject) => resolve("unauthorized"))
        });
      }));
      window.fetch = mockFetch;

      let fetcher = new DataFetcher();
      fetcher.fetchOPDSData("test url").catch(err => {
        expect(err.status).to.equal(401);
        expect(err.response).to.equal("unauthorized");
        expect(err.url).to.equal("test url");
      });
    });
  });
});