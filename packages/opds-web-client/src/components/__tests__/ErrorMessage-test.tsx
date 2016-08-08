jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import ErrorMessage from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("shows the message", () => {
    let wrapper = shallow(
      <ErrorMessage message="test error" />
    );

    let message = wrapper.find(".errorMessage");
    expect(message.text()).toBe("test error");
  });

  it("retries", () => {
    let retry = jest.genMockFunction();
    let wrapper = shallow(
      <ErrorMessage message="test error" retry={retry} />
    );

    let button = wrapper.find(".retryButton");
    button.simulate("click");

    expect(retry.mock.calls.length).toBe(1);
  });

  it("uses bootstrap classes", () => {
    let wrapper = shallow(
      <ErrorMessage message="test error" />
    );

    let buttons = wrapper.find(".btn");
    expect(buttons.length).toBe(1);
  });
});