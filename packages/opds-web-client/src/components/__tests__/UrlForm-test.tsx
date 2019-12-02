import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import { shallow, mount } from "enzyme";

import UrlForm from "../UrlForm";
import { mockRouterContext } from "../../__mocks__/routing";

describe("UrlForm", () => {
  it("shows the form with bootstrap classes", () => {
    let context = mockRouterContext();
    let wrapper = shallow(<UrlForm />, { context });

    let form = wrapper.find("form");
    let input = wrapper.find("input");
    let button = wrapper.find("button");

    expect(form.hasClass("form-inline")).to.equal(true);
    expect(input.hasClass("form-control")).to.equal(true);
    expect(button.hasClass("btn")).to.equal(true);
  });

  it("fetches the url", () => {
    let push = stub();
    let context = mockRouterContext(push);
    let wrapper = mount(<UrlForm />, { context });

    let form = wrapper.find("form");
    let input = wrapper.find("input").getDOMNode();

    input.value = "some url";
    form.simulate("submit");

    expect(push.callCount).to.equal(1);
    expect(push.args[0][0]).to.equal(context.pathFor("some url", null));
  });

  it("should render a label ", () => {
    let context = mockRouterContext();
    let wrapper = mount(<UrlForm />, { context });
    let label = wrapper.find("label");

    expect(label.length).to.equal(1);
    expect(label.prop("htmlFor")).to.equal("opds-input");
  });
});
