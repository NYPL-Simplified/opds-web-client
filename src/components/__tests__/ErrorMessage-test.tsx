jest.dontMock("../ErrorMessage");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import ErrorMessage from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("shows the message", () => {
    let error = TestUtils.renderIntoDocument(
      <ErrorMessage message="test error" closeError={jest.genMockFunction()} />
    );

    let element = ReactDOM.findDOMNode(error);
    expect(element.textContent).toContain("test error");
  });

  it("closes", () => {
    let closeError = jest.genMockFunction();
    let error = TestUtils.renderIntoDocument(
      <ErrorMessage message="test error" closeError={closeError} />
    );

    let button = TestUtils.findRenderedDOMComponentWithClass(error, "errorCloseButton");
    TestUtils.Simulate.click(button);

    expect(closeError.mock.calls.length).toBe(1);
  });

  it("retries", () => {
    let retry = jest.genMockFunction();
    let error = TestUtils.renderIntoDocument(
      <ErrorMessage message="test error" retry={retry} closeError={() => {}} />
    );

    let button = TestUtils.findRenderedDOMComponentWithClass(error, "retryButton");
    TestUtils.Simulate.click(button);

    expect(retry.mock.calls.length).toBe(1);
  });
});