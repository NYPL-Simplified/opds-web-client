jest.autoMockOff();

import * as React from "react";
import { shallow, mount } from "enzyme";

import Search from "../Search";
import { mockRouterContext } from "./routing";

describe("Search", () => {
  it("fetches the search description", () => {
    let fetchSearchDescription = jest.genMockFunction();
    let url = "test url";
    let context = mockRouterContext();
    let search = shallow(
      <Search
        url={url}
        fetchSearchDescription={fetchSearchDescription}
        />,
      { context }
    );
    expect(fetchSearchDescription.mock.calls.length).toEqual(1);
    expect(fetchSearchDescription.mock.calls[0][0]).toEqual("test url");
  });

  it("does not fetch the search description again if url doesn't change", () => {
    let fetchSearchDescription = jest.genMockFunction();
    let url = "test url";
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: (s) => s
    };
    let context = mockRouterContext();
    let wrapper = shallow(
      <Search
        url={url}
        fetchSearchDescription={fetchSearchDescription}
        />,
      { context }
    );
    wrapper.setProps({ url, searchData });
    expect(fetchSearchDescription.mock.calls.length).toEqual(1);
  });

  it("shows the search form with bootstrap classes", () => {
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: (s) => s
    };
    let context = mockRouterContext();
    let wrapper = shallow(
      <Search searchData={searchData} navigate={jest.genMockFunction()} />,
      { context }
    );

    let form = wrapper.find("form");
    let input = wrapper.find("input");
    let button = wrapper.find("button");

    expect(form.hasClass("form-inline")).toBe(true);
    expect(input).toBeTruthy();
    expect(input.props().placeholder).toBe("shortName");
    expect(input.hasClass("form-control")).toBe(true);
    expect(button).toBeTruthy();
    expect(button.hasClass("btn")).toBe(true);
  });

  it("fetches the search feed", () => {
    let navigate = jest.genMockFunction();
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: (s) => s + " template"
    };
    let push = jest.genMockFunction();
    let context = mockRouterContext(push);
    let wrapper = mount(
      <Search searchData={searchData} navigate={navigate} />,
      { context }
    );

    let form = wrapper.find("form").first();
    expect(form).toBeTruthy();

    let input = wrapper.find("input").get(0) as any;
    input.value = "test";
    form.simulate("submit");

    expect(push.mock.calls.length).toEqual(1);
    expect(push.mock.calls[0][0]).toBe(context.pathFor("test template", null));
  });

  it("escapes search terms", () => {
    let navigate = jest.genMockFunction();
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: (s) => s + " template"
    };
    let push = jest.genMockFunction();
    let context = mockRouterContext(push);
    let wrapper = mount(
      <Search searchData={searchData} navigate={navigate} />,
      { context }
    );

    let form = wrapper.find("form").first();
    expect(form).toBeTruthy();

    let input = wrapper.find("input").get(0) as any;
    input.value = "Indésirable";
    form.simulate("submit");

    expect(push.mock.calls.length).toEqual(1);
    expect(push.mock.calls[0][0]).toBe(context.pathFor("Ind%C3%A9sirable template", null));
  });
});