import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import { shallow, mount } from "enzyme";

import Search from "../Search";
import { mockRouterContext } from "../../__mocks__/routing";

describe("Search", () => {
  it("fetches the search description", () => {
    let fetchSearchDescription = stub();
    let url = "test url";
    let context = mockRouterContext();
    let search = shallow(
      <Search url={url} fetchSearchDescription={fetchSearchDescription} />,
      { context }
    );
    expect(fetchSearchDescription.callCount).to.equal(1);
    expect(fetchSearchDescription.args[0][0]).to.equal("test url");
  });

  it("does not fetch the search description again if url doesn't change", () => {
    let fetchSearchDescription = stub();
    let url = "test url";
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: s => s
    };
    let context = mockRouterContext();
    let wrapper = shallow(
      <Search url={url} fetchSearchDescription={fetchSearchDescription} />,
      { context }
    );
    wrapper.setProps({ url, searchData });
    expect(fetchSearchDescription.callCount).to.equal(1);
  });

  it("should have an aria-label for the input", () => {
    let fetchSearchDescription = stub();
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: s => s
    };
    let context = mockRouterContext();
    let wrapper = shallow(
      <Search
        searchData={searchData}
        fetchSearchDescription={fetchSearchDescription}
      />,
      { context }
    );

    let input = wrapper.find("input");

    expect(input.length).to.equal(1);
    expect(input.prop("aria-label")).to.equal(
      "Enter search keyword or keywords"
    );
  });

  it("shows the search form with bootstrap classes", () => {
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: s => s
    };
    let context = mockRouterContext();
    let wrapper = shallow(<Search searchData={searchData} />, { context });

    let form = wrapper.find("form");
    let input = wrapper.find("input");
    let button = wrapper.find("button");

    expect(form.hasClass("form-inline")).to.equal(true);
    expect(input).to.be.ok;
    expect(input.props().placeholder).to.equal("shortName");
    expect(input.hasClass("form-control")).to.equal(true);
    expect(button).to.be.ok;
    expect(button.hasClass("btn")).to.equal(true);
  });

  it("fetches the search feed", () => {
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: s => s + " template"
    };
    let push = stub();
    let context = mockRouterContext(push);
    let wrapper = mount(<Search searchData={searchData} />, { context });

    let form = wrapper.find("form").first();
    expect(form).to.be.ok;

    let input = wrapper.find("input").getDOMNode();
    input.value = "test";
    form.simulate("submit");

    expect(push.callCount).to.equal(1);
    expect(push.args[0][0]).to.equal(context.pathFor("test template", null));
  });

  it("escapes search terms", () => {
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: s => s + " template"
    };
    let push = stub();
    let context = mockRouterContext(push);
    let wrapper = mount(<Search searchData={searchData} />, { context });

    let form = wrapper.find("form").first();
    expect(form).to.be.ok;

    let input = wrapper.find("input").getDOMNode();
    input.value = "Indésirable";
    form.simulate("submit");

    expect(push.callCount).to.equal(1);
    expect(push.args[0][0]).to.equal(
      context.pathFor("Ind%C3%A9sirable template", null)
    );
  });

  it("should add 'all' to language query in search term", () => {
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: s => s + " template"
    };
    let push = stub();
    let context = mockRouterContext(push);
    let wrapper = mount(
      <Search searchData={searchData} allLanguageSearch={true} />,
      { context }
    );

    let form = wrapper.find("form").first();
    expect(form).to.be.ok;

    let input = wrapper.find("input").getDOMNode();
    input.value = "hamlet";
    form.simulate("submit");

    expect(push.callCount).to.equal(1);
    expect(push.args[0][0]).to.equal(
      context.pathFor("hamlet template&language=all", null)
    );
  });
});
