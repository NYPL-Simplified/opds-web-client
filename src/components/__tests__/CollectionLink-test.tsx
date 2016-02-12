jest.dontMock("../Link");
jest.dontMock("../CollectionLink");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import CollectionLink from "../CollectionLink";

let linkProps = {
  text: "test text",
  url: "http://example.com",
  className: "test class"
};

describe("CollectionLink", () => {
  let collectionLink;
  let fetchCollection;

  beforeEach(() => {
    fetchCollection = jest.genMockFunction();
    collectionLink = TestUtils.renderIntoDocument(
      <CollectionLink {...linkProps} fetchCollection={fetchCollection} />
    );
  });

  it("shows the link", () => {
    let link = TestUtils.findRenderedDOMComponentWithTag(collectionLink, "a");
    expect(link.textContent).toBe(linkProps.text);
    expect(link.getAttribute("href")).toBe("?url=" + linkProps.url);
    expect(link.getAttribute("class")).toBe(linkProps.className);
  });

  it("fetches the url if clicked normally", () => {
    let link = TestUtils.findRenderedDOMComponentWithTag(collectionLink, "a");
    TestUtils.Simulate.click(link);
    expect(fetchCollection.mock.calls.length).toBe(1);
    expect(fetchCollection.mock.calls[0][0]).toBe(linkProps.url);
  });

  it("does not fetch the url if clicked with alt, ctrl, cmd, or shift key", () => {
    let link = TestUtils.findRenderedDOMComponentWithTag(collectionLink, "a");
    ["altKey", "ctrlKey", "metaKey", "shiftKey"].forEach(key => {
      TestUtils.Simulate.click(link, { [key]: true });
      expect(fetchCollection.mock.calls.length).toBe(0);
    });
  });
});