import { expect } from "chai";

import * as React from "react";
import { shallow } from "enzyme";

import FacetGroup from "../FacetGroup";
import CatalogLink from "../CatalogLink";
import { FacetGroupData } from "../../interfaces";

describe("FacetGroup", () => {
  it("shows facet group label", () => {
    let facetGroup: FacetGroupData = {
      label: "Availability",
      facets: []
    };

    let wrapper = shallow(<FacetGroup facetGroup={facetGroup} />);

    let label = wrapper.find(".facet-group-label");
    expect(label.text()).to.equal(facetGroup.label);
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

    let wrapper = shallow(<FacetGroup facetGroup={facetGroup} />);

    let links = wrapper.find(CatalogLink);
    expect(links.length).to.equal(2);
    expect(
      links.map(facet =>
        facet
          .children()
          .at(0)
          .text()
      )
    ).to.deep.equal(facetGroup.facets.map(facet => facet.label));
  });
});
