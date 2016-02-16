jest.dontMock("../Facet");
jest.dontMock("../Link");
jest.dontMock("../CollectionLink");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import Facet from "../Facet";

describe("Facet", () => {
  it("shows facet link", () => {
    let facet: FacetData = {
      label: "Available now",
      href: "href",
      active: true
    };

    let renderedFacet = TestUtils.renderIntoDocument(
      <Facet facet={facet} />
    );

    let link = TestUtils.findRenderedDOMComponentWithTag(renderedFacet, "a");
    expect(link.textContent).toEqual(facet.label);
  });

  it("is clickable to navigate to facet", () => {
    let setCollection = jest.genMockFunction();
    let facet: FacetData = {
      label: "Available now",
      href: "href",
      active: true
    };

    let renderedFacet = TestUtils.renderIntoDocument(
      <Facet facet={facet} setCollection={setCollection} />
    );

    let link = TestUtils.findRenderedDOMComponentWithTag(renderedFacet, "a");
    TestUtils.Simulate.click(link);

    expect(setCollection.mock.calls.length).toEqual(1);
    expect(setCollection.mock.calls[0][0]).toEqual("href");
  });
});