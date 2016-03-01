jest.dontMock("../UrlForm");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import UrlForm from "../UrlForm";

describe("UrlForm", () => {
  it("shows the form", () => {
    let setCollection = jest.genMockFunction();
    let form = TestUtils.renderIntoDocument(
      <UrlForm setCollection={setCollection} />
    );

    let input = TestUtils.findRenderedDOMComponentWithTag(form, "input");
    let button = TestUtils.findRenderedDOMComponentWithTag(form, "button");

    expect(input).toBeTruthy;
    expect(button).toBeTruthy;
  });

  it("fetches the url", () => {
    let setCollection = jest.genMockFunction();
    let urlForm = TestUtils.renderIntoDocument(
      <UrlForm setCollection={setCollection} />
    );

    let form = TestUtils.findRenderedDOMComponentWithTag(urlForm, "form");
    let input = TestUtils.findRenderedDOMComponentWithTag(urlForm, "input");

    input["value"] = "some url";
    TestUtils.Simulate.submit(form);

    expect(setCollection.mock.calls.length).toEqual(1);
    expect(setCollection.mock.calls[0][0]).toEqual("some url");
  });
});