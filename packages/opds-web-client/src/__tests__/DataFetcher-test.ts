jest.dontMock("../DataFetcher");

import DataFetcher from "../DataFetcher";
const Cookie = require("js-cookie");

describe("DataFetcher", () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.genMockFunction();
    mockFetch.mockReturnValue(new Promise<any>((resolve, reject) => {
      resolve({ status: 200 });
    }));
    fetch = mockFetch;
  });

  it("uses fetch()", () => {
    let options = {
      method: "POST",
      data: { test: "test" },
      credentials: "same-origin"
    };
    let fetcher = new DataFetcher();
    fetcher.fetch("test url", options);

    expect(mockFetch.mock.calls.length).toBe(1);
    expect(mockFetch.mock.calls[0][0]).toBe("test url");
    expect(mockFetch.mock.calls[0][1]).toEqual(Object.assign({}, options, {
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

    expect(mockFetch.mock.calls.length).toBe(1);
    expect(mockFetch.mock.calls[0][0]).toBe("test url");
    expect(mockFetch.mock.calls[0][1]).toEqual(
      Object.assign({ credentials: "same-origin", headers: {
        "X-Requested-With": "XMLHttpRequest"
      } }, options)
    );
  });

  it("uses proxy url if provided", () => {
    let proxyUrl = "http://example.com";
    let fetcher = new DataFetcher({ proxyUrl });
    fetcher.fetch("test url");

    let formData = new FormData();
    formData.append("url", proxyUrl);
    expect(mockFetch.mock.calls.length).toBe(1);
    expect(mockFetch.mock.calls[0][0]).toBe(proxyUrl);
    expect(mockFetch.mock.calls[0][1].method).toBe("POST");
    expect(mockFetch.mock.calls[0][1].body.get("url").value).toEqual("test url");
  });

  it("prepares basic auth headers", () => {
    let fetcher = new DataFetcher();
    fetcher.getBasicAuthCredentials = () => "credentials";
    fetcher.fetch("test url");
    expect(mockFetch.mock.calls[0][1].headers["Authorization"]).toBe("Basic credentials");
  });

  it("sets basic auth credentials", () => {
    let fetcher = new DataFetcher();
    fetcher.setBasicAuthCredentials("credentials");
    expect(Cookie.get(fetcher.basicAuthKey)).toBe("credentials");
  });

  it("gets basic auth credentials", () => {
    let fetcher = new DataFetcher();
    Cookie.set(fetcher.basicAuthKey, "credentials");
    expect(fetcher.getBasicAuthCredentials()).toBe("credentials");
  });

  it("clears basic auth credentials", () => {
    let fetcher = new DataFetcher();
    Cookie.set(fetcher.basicAuthKey, "credentials");
    fetcher.clearBasicAuthCredentials();
    expect(Cookie.get(fetcher.basicAuthKey)).toBe(undefined);
  });

  describe("fetchOPDSData()", () => {
    it("throws error if response isn't 200", (done) => {
      mockFetch = jest.genMockFunction();
      mockFetch.mockReturnValue(new Promise<any>((resolve, reject) => {
        resolve({
          status: 401,
          text: () => new Promise((resolve, reject) => resolve("unauthorized"))
        });
      }));
      fetch = mockFetch;

      let fetcher = new DataFetcher();
      fetcher.fetchOPDSData("test url").catch(err => {
        expect(err.status).toBe(401);
        expect(err.response).toBe("unauthorized");
        expect(err.url).toBe("test url");
        done();
      });
    });
  });
});