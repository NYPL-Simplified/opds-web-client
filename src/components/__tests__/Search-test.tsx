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

  it("shows the search form", () => {
    let searchData = {
      data: {
        description: "description",
        shortName: "shortName",
        template: (s) => s
      }
    };
    let search = TestUtils.renderIntoDocument(
      <Search {...searchData} />
    );

    let input = TestUtils.findRenderedDOMComponentWithTag(search, "input");
    let button = TestUtils.findRenderedDOMComponentWithTag(search, "button");

    expect(input).toBeTruthy;
    expect(input.getAttribute("placeholder")).toEqual("shortName");
    expect(button).toBeTruthy;
  });

  it("fetches the search feed", () => {
    let fetchCollection = jest.genMockFunction();
    let searchData = {
      data: {
        description: "description",
        shortName: "shortName",
        template: (s) => s + " template"
      },
      fetchCollection: fetchCollection
    };
    let search = TestUtils.renderIntoDocument(
      <Search {...searchData} />
    );

    let form = TestUtils.findRenderedDOMComponentWithTag(search, "form");
    expect(form).toBeTruthy;

    let input = TestUtils.findRenderedDOMComponentWithTag(search, "input");
    input["value"] = "test";
    TestUtils.Simulate.submit(form);

    expect(fetchCollection.mock.calls.length).toEqual(1);
    expect(fetchCollection.mock.calls[0][0]).toEqual("test template");
  });
});