jest.dontMock("../FacetGroup");
jest.dontMock("../Link");
jest.dontMock("../CollectionLink");
jest.dontMock("../SkipNavigationLink");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import FacetGroup from "../FacetGroup";
import SkipNavigationLink from "../SkipNavigationLink";
import { FacetGroupData } from "../../interfaces";

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
      facets: [
        {
          label: "Available now",
          href: "available href",
          active: true
        },
        {
          label: "All",
          href: "all href",
          active: false
        }
      ]
    };

    let renderedFacetGroup = TestUtils.renderIntoDocument(
      <FacetGroup facetGroup={facetGroup} />
    );

    let facets = TestUtils.scryRenderedDOMComponentsWithClass(renderedFacetGroup, "facetLink");
    expect(facets.length).toEqual(2);
    expect(facets.map(facet => facet.textContent)).toEqual(facetGroup.facets.map(facet => facet.label));
  });
});