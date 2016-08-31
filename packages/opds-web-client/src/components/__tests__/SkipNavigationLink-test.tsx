import { expect } from "chai";

import * as React from "react";
import { shallow } from "enzyme";

import SkipNavigationLink from "../SkipNavigationLink";

describe("SkipNavigationLink", () => {
  it("shows link", () => {
    let wrapper = shallow(
      <SkipNavigationLink />
    );

    let element = wrapper.find(".skipNavigation");
    expect(element.text()).to.equal("Skip Navigation");
    expect(element.props().href).to.equal("#main");
  });
});