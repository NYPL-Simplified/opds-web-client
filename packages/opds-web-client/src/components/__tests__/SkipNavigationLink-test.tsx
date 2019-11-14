import { expect } from "chai";

import * as React from "react";
import { shallow } from "enzyme";

import SkipNavigationLink from "../SkipNavigationLink";

describe("SkipNavigationLink", () => {
  it("shows link", () => {
    let wrapper = shallow(<SkipNavigationLink target="#main" />);

    let element = wrapper.find(".skip-navigation a");
    expect(element.text()).to.equal("Skip navigation");
    expect(element.props().href).to.equal("#main");
  });

  it("uses label", () => {
    let wrapper = shallow(
      <SkipNavigationLink target="#main" label="skippable things" />
    );
    let element = wrapper.find(".skip-navigation a");
    expect(element.text()).to.equal("Skip skippable things");
  });
});
