jest.dontMock("../Link");
jest.dontMock("../CollectionLink");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import CollectionLink from "../CollectionLink";

let linkProps = {
  text: "test text",
  url: "http://example.com",
  className: "test class",
  isTopLevel: true
};

describe("CollectionLink", () => {
  let collectionLink;
  let navigate;
  let pathFor;

  beforeEach(() => {
    navigate = jest.genMockFunction();
    pathFor = jest.genMockFunction();
    pathFor.mockReturnValue("path");
    collectionLink = TestUtils.renderIntoDocument(
      <CollectionLink {...linkProps} navigate={navigate} pathFor={pathFor} />
    );
  });

  it("shows the link", () => {
    let link = TestUtils.findRenderedDOMComponentWithTag(collectionLink, "a");
    expect(link.textContent).toBe(linkProps.text);
    expect(link.getAttribute("class")).toBe(linkProps.className);
  });

  it("calls pathFor on the collection url", () => {
    let link = TestUtils.findRenderedDOMComponentWithTag(collectionLink, "a");
    expect(link.getAttribute("href")).toBe("path");
    expect(pathFor.mock.calls.length).toBe(1);
    expect(pathFor.mock.calls[0][0]).toBe(linkProps.url);
    expect(pathFor.mock.calls[0][1]).toBeFalsy();
  });

  it("navigates to the url if clicked normally", () => {
    let link = TestUtils.findRenderedDOMComponentWithTag(collectionLink, "a");
    TestUtils.Simulate.click(link);
    expect(navigate.mock.calls.length).toBe(1);
    expect(navigate.mock.calls[0][0]).toBe(linkProps.url);
    expect(navigate.mock.calls[0][1]).toBe(null);
  });

  it("does not navigate to the url if clicked with alt, ctrl, cmd, or shift key", () => {
    let link = TestUtils.findRenderedDOMComponentWithTag(collectionLink, "a");
    ["altKey", "ctrlKey", "metaKey", "shiftKey"].forEach(key => {
      TestUtils.Simulate.click(link, { [key]: true });
      expect(navigate.mock.calls.length).toBe(0);
    });
  });

  it("passes isTopLevel prop to navigate()", () => {
    let link = TestUtils.findRenderedDOMComponentWithTag(collectionLink, "a");
    TestUtils.Simulate.click(link);
    expect(navigate.mock.calls[0][2]).toBe(true);
  });
});