import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import { shallow, mount } from "enzyme";

import BasicAuthForm from "../BasicAuthForm";

describe("BasicAuthForm", () => {
  describe("rendering", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <BasicAuthForm
          hide={stub()}
          saveCredentials={stub()}
          title="Intergalactic Spy Network"
          loginLabel="code name"
          passwordLabel="secret password"
          error="you forgot the secret password! what kind of spy arre you?"
          />
      );
    });

    it("shows title", () => {
      let title = wrapper.find("h3");
      expect(title.text()).to.equal("Intergalactic Spy Network Login");
    });

    it("shows username input", () => {
      let input = wrapper.find("input[type='text']");
      expect(input.prop("placeholder")).to.equal("code name");
    });

    it("shows password input", () => {
      let input = wrapper.find("input[type='password']");
      expect(input.prop("placeholder")).to.equal("secret password");
    });

    it("shows submit button", () => {
      let input = wrapper.find("input[type='submit']");
      expect(input.prop("value")).to.equal("Submit");
    });

    it("shows error", () => {
      let error = wrapper.find(".error");
      expect(error.text()).to.equal("you forgot the secret password! what kind of spy arre you?");
    });
  });

  describe("behavior", () => {
    let wrapper;
    let hide;
    let saveCredentials;
    let callback;

    beforeEach(() => {
      hide = stub();
      saveCredentials = stub();
      callback = stub();
      wrapper = mount(
        <BasicAuthForm
          hide={hide}
          saveCredentials={saveCredentials}
          callback={callback}
          title="Intergalactic Spy Network"
          loginLabel="code name"
          passwordLabel="secret password"
          error="you forgot the secret password! what kind of spy arre you?"
          />
      );
    });

    it("validates", () => {
      // both fields blank
      let isValid = wrapper.instance().validate();
      expect(isValid).to.equal(false);
      expect(wrapper.state("error")).to.equal("code name and secret password are required");

      // password blank
      let username = wrapper.find("input[type='text']").get(0);
      username.value = "doubleohseven";
      isValid = wrapper.instance().validate();
      expect(isValid).to.equal(false);
      expect(wrapper.state("error")).to.equal("code name and secret password are required");

      // username blank
      username.value = "";
      let password = wrapper.find("input[type='password']").get(0);
      password.value = "thenameisbond";
      isValid = wrapper.instance().validate();
      expect(isValid).to.equal(false);
      expect(wrapper.state("error")).to.equal("code name and secret password are required");

      // nothing blank
      username.value = "doubleohseven";
      isValid = wrapper.instance().validate();
      expect(isValid).to.equal(true);
      expect(wrapper.state("error")).to.equal(null);
    });

    describe("submission", () => {
      let validate;
      let form;
      let credentials;
      let username;
      let password;

      beforeEach(() => {
        username = wrapper.find("input[type='text']").get(0);
        username.value = "doubleohseven";
        password = wrapper.find("input[type='password']").get(0);
        password.value = "thenameisbond";
        credentials = wrapper.instance().generateCredentials("doubleohseven", "thenameisbond");
        validate = stub().returns(true);
        wrapper.instance().validate = validate;
        form = wrapper.find("form");
        form.simulate("submit");
      });

      it("validates", () => {
        expect(validate.callCount).to.equal(1);
      });

      it("saves credentials", () => {
        expect(saveCredentials.callCount).to.equal(1);
        expect(saveCredentials.args[0][0]).to.equal(credentials);
      });

      it("hides", () => {
        expect(hide.callCount).to.equal(1);
      });

      it("executes callback", () => {
        expect(callback.callCount).to.equal(1);
        expect(callback.args[0][0]).to.equal(credentials);
      });
    });

    it("updates error from props", () => {
      wrapper.setProps(
        Object.assign({}, wrapper.props(), { error: "new error" })
      );
      expect(wrapper.state("error")).to.equal("new error");
    });
  });
});