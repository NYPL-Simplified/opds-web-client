jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import SkipNavigationLink from "../SkipNavigationLink";

describe("SkipNavigationLink", () => {
  it("shows link", () => {
    let wrapper = shallow(
      <SkipNavigationLink />
    );

    let element = wrapper.find(".skipNavigation");
    expect(element.text()).toBe("Skip Navigation");
    expect(element.props().href).toBe("#main");
  });
});