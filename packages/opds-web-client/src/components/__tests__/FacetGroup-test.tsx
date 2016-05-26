jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import FacetGroup from "../FacetGroup";
import CatalogLink from "../CatalogLink";
import SkipNavigationLink from "../SkipNavigationLink";
import { FacetGroupData } from "../../interfaces";

describe("FacetGroup", () => {
  it("shows facet group label", () => {
    let facetGroup: FacetGroupData = {
      label: "Availability",
      facets: []
    };

    let wrapper = shallow(
      <FacetGroup facetGroup={facetGroup} />
    );

    let label = wrapper.find(".facet-group-label");
    expect(label.text()).toEqual(facetGroup.label + ":");
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

    let wrapper = shallow(
      <FacetGroup facetGroup={facetGroup} />
    );

    let links = wrapper.find(CatalogLink);
    expect(links.length).toEqual(2);
    expect(links.map(facet => facet.children().at(0).text())).toEqual(facetGroup.facets.map(facet => facet.label));
  });
});