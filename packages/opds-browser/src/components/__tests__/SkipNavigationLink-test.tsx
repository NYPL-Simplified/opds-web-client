jest.dontMock("../SkipNavigationLink");

import * as React from "react";
import * as TestUtils from "react-addons-test-utils";

import SkipNavigationLink from "../SkipNavigationLink";

describe("SkipNavigationLink", () => {
  it("shows link", () => {
    let component = TestUtils.renderIntoDocument(
      <SkipNavigationLink />
    ) as SkipNavigationLink;

    let element = TestUtils.findRenderedDOMComponentWithClass(component, "skipNavigation");
    expect(element.textContent).toBe("Skip Navigation");
    expect(element.getAttribute("href")).toBe("#main");
  });
});