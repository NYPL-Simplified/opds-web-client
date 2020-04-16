import { expect } from "chai";

import * as React from "react";
import { shallow } from "enzyme";

import CatalogLink from "../CatalogLink";
import { Link } from "react-router";
import { mockRouterContext } from "../../__mocks__/routing";

describe("CatalogLink", () => {
  it("renders Link with location and props and context", () => {
    let props = {
      className: "test-class",
      id: "test-id",
      target: "_blank",
      collectionUrl: "test collection",
      bookUrl: "test book"
    };
    let context = mockRouterContext();
    let location = context.pathFor(props.collectionUrl, props.bookUrl);
    let linkProps = Object.assign({}, Link.defaultProps, props, {
      to: location
    });
    delete linkProps["collectionUrl"];
    delete linkProps["bookUrl"];
    let requiredRouterKeys = [
      "push",
      "createHref",
      "replace",
      "go",
      "goBack",
      "goForward",
      "setRouteLeaveHook"
    ];

    let wrapper = shallow(<CatalogLink {...props} />, { context });

    let link = wrapper.find(Link);
    let instance = wrapper.instance() as any;
    let linkContextRouterKeys = Object.keys(instance.getChildContext().router);

    expect(link.props()).to.deep.equal(linkProps);
    expect(linkContextRouterKeys).to.deep.equal(requiredRouterKeys);
  });

  it("passes children to Link", () => {
    let props = {
      className: "test-class",
      id: "test-id",
      target: "_blank",
      collectionUrl: "test collection",
      bookUrl: "test book"
    };
    let context = mockRouterContext();

    let wrapper = shallow(
      <CatalogLink {...props}>
        <div className="child"></div>
      </CatalogLink>,
      { context }
    );

    let child = wrapper.children().first();
    expect(child.hasClass("child")).to.equal(true);
  });
});
