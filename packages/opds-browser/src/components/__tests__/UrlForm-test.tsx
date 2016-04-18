jest.dontMock("../UrlForm");
jest.dontMock("./routing");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import UrlForm, { UrlFormProps} from "../UrlForm";
import withRouterContext from "./routing";

const UrlFormWithContext = withRouterContext<UrlFormProps>(UrlForm);

describe("UrlForm", () => {
  it("shows the form with bootstrap classes", () => {
    let navigate = jest.genMockFunction();
    let form = TestUtils.renderIntoDocument(
      <UrlFormWithContext />
    ) as UrlForm;

    let formNode = TestUtils.findRenderedDOMComponentWithTag(form, "form");
    let input = TestUtils.findRenderedDOMComponentWithTag(form, "input");
    let button = TestUtils.findRenderedDOMComponentWithTag(form, "button");

    expect(formNode.getAttribute("class")).toContain("form-inline");
    expect(input).toBeTruthy();
    expect(input.getAttribute("class")).toContain("form-control");
    expect(button).toBeTruthy();
    expect(button.getAttribute("class").split(" ")).toContain("btn");
  });

  it("fetches the url", () => {
    let push = jest.genMockFunction();
    let pathFor = (c, b) => c + "::" + b;
    let urlForm = TestUtils.renderIntoDocument(
      <UrlFormWithContext push={push} pathFor={pathFor} />
    ) as UrlForm;

    let form = TestUtils.findRenderedDOMComponentWithTag(urlForm, "form");
    let input = TestUtils.findRenderedDOMComponentWithTag(urlForm, "input");

    input["value"] = "some url";
    TestUtils.Simulate.submit(form);

    expect(push.mock.calls.length).toEqual(1);
    expect(push.mock.calls[0][0]).toEqual(pathFor("some url", null));
  });
});