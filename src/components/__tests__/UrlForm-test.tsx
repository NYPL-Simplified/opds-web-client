jest.dontMock("../UrlForm");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import UrlForm from "../UrlForm";

describe("UrlForm", () => {
  it("shows the form", () => {
    let fetchUrl = jest.genMockFunction();
    let form = TestUtils.renderIntoDocument(
      <UrlForm fetchUrl={fetchUrl} />
    );

    let input = TestUtils.findRenderedDOMComponentWithTag(form, "input");
    let button = TestUtils.findRenderedDOMComponentWithTag(form, "button");

    expect(input).toBeTruthy;
    expect(button).toBeTruthy;
  });

  it("fetches the url", () => {
    let fetchUrl = jest.genMockFunction();
    let form = TestUtils.renderIntoDocument(
      <UrlForm fetchUrl={fetchUrl} />
    );

    let input = TestUtils.findRenderedDOMComponentWithTag(form, "input");
    let button = TestUtils.findRenderedDOMComponentWithTag(form, "button");

    input["value"] = "some url";
    TestUtils.Simulate.click(button);

    expect(fetchUrl.mock.calls.length).toEqual(1);
    expect(fetchUrl.mock.calls[0][0]).toEqual("some url");
  });
});