jest.dontMock("../DataFetcher");

import DataFetcher from "../DataFetcher";

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
    expect(mockFetch.mock.calls[0][1]).toBe(options);
  });

  it("uses proxy url if provided", () => {
    let proxyUrl = "http://example.com";
    let fetcher = new DataFetcher(proxyUrl);
    fetcher.fetch("test url");

    let formData = new FormData();
    formData.append("url", proxyUrl);
    expect(mockFetch.mock.calls.length).toBe(1);
    expect(mockFetch.mock.calls[0][0]).toBe(proxyUrl);
    expect(mockFetch.mock.calls[0][1].method).toBe("POST");
    expect(mockFetch.mock.calls[0][1].body.get("url").value).toEqual(encodeURIComponent("test url"));
  });
});