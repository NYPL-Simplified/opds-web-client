jest.dontMock("../OPDSBrowser");
jest.setMock("../../store", {
  default: () => "test store"
});

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import OPDSBrowser from "../OPDSBrowser";
import Root from "../Root";
import buildStore from "../../store";

describe("OPDSBrowser", () => {
  let browser;
  let props = {
    collectionUrl: "collection url",
    bookUrl: "book url",
    proxyUrl: "proxy url",
    navigate: jest.genMockFunction(),
    pathFor: (collectionUrl: string, bookUrl: string): string => { return "path"; },
    bookData: {
      id: "book id",
      title: "book title",
      url: "book url"
    },
    pageTitleTemplate: (c, b) => "test title"
  };

  beforeEach(() => {
    browser = TestUtils.renderIntoDocument(
      <OPDSBrowser {...props} />
    );
  });

  it("creates a store for Root if not given one", () => {
    let root = TestUtils.findRenderedComponentWithType(browser, Root);
    expect(root.props.store).toBeTruthy();
  });

  it("passes store to Root if given one", () => {
    let store = buildStore();

    browser = TestUtils.renderIntoDocument(
      <OPDSBrowser {...props} store={store} />
    );

    let root = TestUtils.findRenderedComponentWithType(browser, Root);
    expect(root.props.store).toBe(store);
  });

  it("passes props to Root", () => {
    let root = TestUtils.findRenderedComponentWithType(browser, Root);

    Object.keys(props).forEach(key => {
      expect(root.props[key]).toEqual(props[key]);
    });
  });
});