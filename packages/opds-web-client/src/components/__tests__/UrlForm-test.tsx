jest.autoMockOff();

import * as React from "react";
import { shallow, mount } from "enzyme";

import UrlForm from "../UrlForm";
import { mockRouterContext } from "./routing";

describe("UrlForm", () => {
  it("shows the form with bootstrap classes", () => {
    let context = mockRouterContext();
    let wrapper = shallow(
      <UrlForm />,
      { context }
    );

    let form = wrapper.find("form");
    let input = wrapper.find("input");
    let button = wrapper.find("button");

    expect(form.hasClass("form-inline")).toBe(true);
    expect(input.hasClass("form-control")).toBe(true);
    expect(button.hasClass("btn")).toBe(true);
  });

  it("fetches the url", () => {
    let push = jest.genMockFunction();
    let context = mockRouterContext(push);
    let wrapper = mount(
      <UrlForm />,
      { context }
    );

    let form = wrapper.find("form");
    let input = wrapper.find("input").get(0) as any;

    input.value = "some url";
    form.simulate("submit");

    expect(push.mock.calls.length).toEqual(1);
    expect(push.mock.calls[0][0]).toEqual(context.pathFor("some url", null));
  });
});