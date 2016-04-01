jest.dontMock("../Search");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import Search from "../Search";

describe("Search", () => {
  it("fetches the search description", () => {
    let fetchSearchDescription = jest.genMockFunction();
    let url = "test url";
    let search = TestUtils.renderIntoDocument(
      <Search url={url} fetchSearchDescription={fetchSearchDescription} />
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
    let element = document.createElement("div");
    ReactDOM.render(
      <Search url={url} fetchSearchDescription={fetchSearchDescription} />,
      element
    );
    ReactDOM.render(
      <Search url={url} searchData={searchData} fetchSearchDescription={fetchSearchDescription} />,
      element
    );
    expect(fetchSearchDescription.mock.calls.length).toEqual(1);
  });

  it("shows the search form with bootstrap classes", () => {
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: (s) => s
    };
    let search = TestUtils.renderIntoDocument(
      <Search searchData={searchData} />
    );

    let form = TestUtils.findRenderedDOMComponentWithTag(search, "form");
    let input = TestUtils.findRenderedDOMComponentWithTag(search, "input");
    let button = TestUtils.findRenderedDOMComponentWithTag(search, "button");

    expect(form.getAttribute("class")).toContain("form-inline");
    expect(input).toBeTruthy();
    expect(input.getAttribute("placeholder")).toEqual("shortName");
    expect(input.getAttribute("class")).toContain("form-control");
    expect(button).toBeTruthy();
    expect(button.getAttribute("class").split(" ")).toContain("btn");
  });

  it("fetches the search feed", () => {
    let navigate = jest.genMockFunction();
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: (s) => s + " template"
    };
    let search = TestUtils.renderIntoDocument(
      <Search searchData={searchData} navigate={navigate} />
    );

    let form = TestUtils.findRenderedDOMComponentWithTag(search, "form");
    expect(form).toBeTruthy();

    let input = TestUtils.findRenderedDOMComponentWithTag(search, "input");
    input["value"] = "test";
    TestUtils.Simulate.submit(form);

    expect(navigate.mock.calls.length).toEqual(1);
    expect(navigate.mock.calls[0][0]).toEqual("test template");
  });

  it("escapes search terms", () => {
    let navigate = jest.genMockFunction();
    let searchData = {
      description: "description",
      shortName: "shortName",
      template: (s) => s + " template"
    };
    let search = TestUtils.renderIntoDocument(
      <Search searchData={searchData} navigate={navigate} />
    );

    let form = TestUtils.findRenderedDOMComponentWithTag(search, "form");
    expect(form).toBeTruthy();

    let input = TestUtils.findRenderedDOMComponentWithTag(search, "input");
    input["value"] = "Indésirable";
    TestUtils.Simulate.submit(form);

    expect(navigate.mock.calls.length).toEqual(1);
    expect(navigate.mock.calls[0][0]).toEqual("Ind%C3%A9sirable template");
  });
});