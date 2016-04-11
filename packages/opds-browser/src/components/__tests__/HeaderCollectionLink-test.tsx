jest.dontMock("../Link");
jest.dontMock("../CollectionLink");
jest.dontMock("../HeaderCollectionLink");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import HeaderCollectionLink from "../HeaderCollectionLink";

let linkProps = {
  text: "test text",
  url: "http://example.com",
  className: "test class",
  isTopLevel: true
};

describe("HeaderCollectionLink", () => {
  let headerCollectionLink;
  let navigate;
  let pathFor;

  beforeEach(() => {
    navigate = jest.genMockFunction();
    pathFor = jest.genMockFunction();
    pathFor.mockReturnValue("path");
    headerCollectionLink = TestUtils.renderIntoDocument(
      <HeaderCollectionLink {...linkProps} navigate={navigate} pathFor={pathFor} />
    );
  });

  it("shows the link", () => {
    let link = TestUtils.findRenderedDOMComponentWithTag(headerCollectionLink, "a");
    expect(link.textContent).toBe(linkProps.text);
    expect(link.getAttribute("class")).toBe(linkProps.className);
  });

  it("navigates top-level", () => {
    let link = TestUtils.findRenderedDOMComponentWithTag(headerCollectionLink, "a");
    TestUtils.Simulate.click(link);
    expect(navigate.mock.calls.length).toBe(1);
    expect(navigate.mock.calls[0][0]).toBe(linkProps.url);
    expect(navigate.mock.calls[0][1]).toBe(null);
    expect(navigate.mock.calls[0][2]).toBe(true);
  });
});