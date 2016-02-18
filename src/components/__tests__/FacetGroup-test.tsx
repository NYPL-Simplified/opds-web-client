jest.dontMock("../FacetGroup");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import FacetGroup from "../FacetGroup";
import Facet from "../Facet";

describe("FacetGroup", () => {
  it("shows facet group label", () => {
    let facetGroup: FacetGroupData = {
      label: "Availability",
      facets: []
    };

    let renderedFacetGroup = TestUtils.renderIntoDocument(
      <FacetGroup facetGroup={facetGroup} />
    );

    let label = TestUtils.findRenderedDOMComponentWithClass(renderedFacetGroup, "facet-group-label");
    expect(label.textContent).toEqual(facetGroup.label + ":");
  });

  it("shows facets", () => {
    let facetGroup = {
      label: "Availability",
      facets: [{
        label: "Available now",
        href: "href",
        active: true
      }]
    };

    let renderedFacetGroup = TestUtils.renderIntoDocument(
      <FacetGroup facetGroup={facetGroup} />
    );

    let facets = TestUtils.scryRenderedComponentsWithType(renderedFacetGroup, Facet);
    expect(facets.length).toEqual(1);
  });
});