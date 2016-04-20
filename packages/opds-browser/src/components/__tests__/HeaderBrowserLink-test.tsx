jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import HeaderBrowserLink from "../HeaderBrowserLink";
import BrowserLink, { BrowserLinkProps } from "../BrowserLink";
import { mockRouterContext } from "./routing";

let linkProps = {
  collectionUrl: "http://example.com",
  bookUrl: null,
  className: "test-class"
};

describe("HeaderBrowserLink", () => {
  let push;
  let context;

  beforeEach(() => {
    context = mockRouterContext();
  });

  it("shows top-level BrowserLink", () => {
    let wrapper = shallow<BrowserLinkProps, any>(
      <HeaderBrowserLink {...linkProps}>test link</HeaderBrowserLink>,
      { context }
    );

    let browserLink = wrapper.find<BrowserLinkProps>(BrowserLink);
    expect(browserLink.props().children).toContain("test link");
    expect(browserLink.props().collectionUrl).toBe(linkProps.collectionUrl);
    expect(browserLink.props().bookUrl).toBe(linkProps.bookUrl);
    expect(browserLink.props().isTopLevel).toBe(true);
  });
});