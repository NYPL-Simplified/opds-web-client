import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import { shallow } from "enzyme";

import ErrorMessage from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("shows the message", () => {
    let wrapper = shallow(<ErrorMessage message="test error" />);

    let message = wrapper.find(".message");
    expect(message.text()).to.equal("test error");
  });

  it("retries", () => {
    let retry = stub();
    let wrapper = shallow(<ErrorMessage message="test error" retry={retry} />);

    let button = wrapper.find(".retry-button");
    button.simulate("click");

    expect(retry.callCount).to.equal(1);
  });

  it("closes", () => {
    let close = stub();
    let wrapper = shallow(<ErrorMessage message="test error" close={close} />);

    let button = wrapper.find(".close-button");
    button.simulate("click");

    expect(close.callCount).to.equal(1);
  });

  it("uses bootstrap classes", () => {
    let wrapper = shallow(<ErrorMessage message="test error" retry={stub()} />);

    let buttons = wrapper.find(".btn");
    expect(buttons.length).to.equal(1);
  });
});
