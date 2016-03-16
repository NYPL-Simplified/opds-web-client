jest.dontMock("../ErrorMessage");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import ErrorMessage from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("shows the message", () => {
    let error = TestUtils.renderIntoDocument(
      <ErrorMessage message="test error" />
    );

    let element = ReactDOM.findDOMNode(error);
    expect(element.textContent).toContain("test error");
  });

  it("goes back", () => {
    let error = TestUtils.renderIntoDocument(
      <ErrorMessage message="test error" />
    );

    let button = TestUtils.findRenderedDOMComponentWithClass(error, "errorCloseButton");
    spyOn(window.history, "back");
    TestUtils.Simulate.click(button);

    expect(window.history.back).toHaveBeenCalled();
  });

  it("retries", () => {
    let retry = jest.genMockFunction();
    let error = TestUtils.renderIntoDocument(
      <ErrorMessage message="test error" retry={retry} />
    );

    let button = TestUtils.findRenderedDOMComponentWithClass(error, "retryButton");
    TestUtils.Simulate.click(button);

    expect(retry.mock.calls.length).toBe(1);
  });

  it("uses bootstrap classes", () => {
    let error = TestUtils.renderIntoDocument(
      <ErrorMessage message="test error" />
    );

    let buttons = TestUtils.scryRenderedDOMComponentsWithClass(error, "btn");
    expect(buttons.length).toBe(2);
  });
});