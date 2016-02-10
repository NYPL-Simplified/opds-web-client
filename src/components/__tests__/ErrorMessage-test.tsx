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

    let button = TestUtils.findRenderedDOMComponentWithTag(error, "button");
    TestUtils.Simulate.click(button);

    expect(closeError.mock.calls.length).toBe(1);
  });
});