jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import BrowserLink from "../BrowserLink";
import { Link } from "react-router";
import { mockRouterContext } from "./routing";

describe("BrowseLink", () => {
  it("renders Link with location and props and context", () => {
    let props = {
      className: "test-class",
      id: "test-id",
      target: "_blank",
      collectionUrl: "test collection",
      bookUrl: "test book",
      isTopLevel: true
    };
    let context = mockRouterContext();
    let location = {
      pathname: context.pathFor(props.collectionUrl, props.bookUrl),
      state: { isTopLevel: true }
    };
    let linkProps = Object.assign({}, Link.defaultProps, props, { to: location });
    let requiredRouterKeys = [
      "push", "createHref", "isActive", "replace",
      "go", "goBack", "goForward", "setRouteLeaveHook"
    ];

    let wrapper = shallow(
      <BrowserLink {...props} />,
      { context }
    );

    let link = wrapper.find(Link);
    let instance = wrapper.instance() as any;
    let linkContextRouterKeys = Object.keys(instance.getChildContext().router);

    expect(link.props()).toEqual(linkProps);
    expect(linkContextRouterKeys).toEqual(requiredRouterKeys);
  });

  it("passes children to Link", () => {
    let props = {
      className: "test-class",
      id: "test-id",
      target: "_blank",
      collectionUrl: "test collection",
      bookUrl: "test book",
      isTopLevel: false
    };
    let context = mockRouterContext();

    let wrapper = shallow(
      <BrowserLink {...props}>
        <div className="child"></div>
      </BrowserLink>,
      { context }
    );

    let child = wrapper.children().first();
    expect(child.hasClass("child")).toBe(true);
  });
});