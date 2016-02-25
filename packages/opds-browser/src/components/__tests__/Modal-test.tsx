jest.dontMock("../Modal");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import Modal from "../Modal";

describe("Modal", () => {
  let modal, close;

  beforeEach(() => {
    close = jest.genMockFunction();
    modal = TestUtils.renderIntoDocument(
      <Modal close={close}>content</Modal>
    );
  });

  it("shows modal content", () => {
    let renderedModal = TestUtils.findRenderedDOMComponentWithClass(modal, "modalContent");
    expect(renderedModal.textContent).toContain("content");
  });

  it("hides when close link is clicked", () => {
    let link = TestUtils.findRenderedDOMComponentWithClass(modal, "closeLink");
    expect(link.textContent).toEqual("Close");
    TestUtils.Simulate.click(link);
    expect(close.mock.calls.length).toBe(1);
  });

  it("hides when background screen is clicked", () => {
    let screen = TestUtils.findRenderedDOMComponentWithClass(modal, "modalScreen");
    TestUtils.Simulate.click(screen);
    expect(close.mock.calls.length).toBe(1);
  });
});