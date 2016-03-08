jest.autoMockOff();

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import OPDSBrowser from "../OPDSBrowser";
import Root from "../Root";

describe("OPDSBrowser", () => {
  let browser;
  let props = {
    collectionUrl: "collection url",
    bookUrl: "book url",
    proxyUrl: "proxy url",
    onNavigate: function() {},
    pathFor: function(collectionUrl: string, bookUrl: string): string { return "path"; }
  };

  beforeEach(() => {
    browser = TestUtils.renderIntoDocument(
      <OPDSBrowser {...props} />
    );
  });

  it("passes a store to Root", () => {
    let root = TestUtils.findRenderedComponentWithType(browser, Root);
    expect(root.props.store).toBeTruthy;
  });

  it("passes props to Root", () => {
    let root = TestUtils.findRenderedComponentWithType(browser, Root);

    Object.keys(props).forEach(key => {
      expect(root.props[key]).toEqual(props[key]);
    });
  });

  it("puts Root in a 'root' ref", () => {
    let root = TestUtils.findRenderedComponentWithType(browser, Root);

    Object.keys(props).forEach(key => {
      expect(browser.root.props[key]).toEqual(props[key]);
    });
  });
});

