jest.autoMockOff();

import * as React from "react";
import { shallow, mount } from "enzyme";

import BasicAuthForm from "../BasicAuthForm";

describe("BasicAuthForm", () => {
  describe("rendering", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <BasicAuthForm
          hide={jest.genMockFunction()}
          saveCredentials={jest.genMockFunction()}
          title="Intergalactic Spy Network"
          loginLabel="code name"
          passwordLabel="secret password"
          error="you forgot the secret password! what kind of spy arre you?"
          />
      );
    });

    it("shows title", () => {
      let title = wrapper.find("h3");
      expect(title.text()).toBe("Intergalactic Spy Network Login");
    });

    it("shows username input", () => {
      let input = wrapper.find("input[type='text']");
      expect(input.prop("placeholder")).toBe("code name");
    });

    it("shows password input", () => {
      let input = wrapper.find("input[type='password']");
      expect(input.prop("placeholder")).toBe("secret password");
    });

    it("shows submit button", () => {
      let input = wrapper.find("input[type='submit']");
      expect(input.prop("value")).toBe("Submit");
    });

    it("shows error", () => {
      let error = wrapper.find(".authFormError");
      expect(error.text()).toBe("you forgot the secret password! what kind of spy arre you?");
    });
  });

  describe("behavior", () => {
    let wrapper;
    let hide;
    let saveCredentials;
    let callback;

    beforeEach(() => {
      hide = jest.genMockFunction();
      saveCredentials = jest.genMockFunction();
      callback = jest.genMockFunction();
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
      expect(isValid).toBe(false);
      expect(wrapper.state("error")).toBe("code name and secret password are required");

      // password blank
      let username = wrapper.find("input[type='text']").get(0);
      username.value = "doubleohseven";
      isValid = wrapper.instance().validate();
      expect(isValid).toBe(false);
      expect(wrapper.state("error")).toBe("code name and secret password are required");

      // username blank
      username.value = "";
      let password = wrapper.find("input[type='password']").get(0);
      password.value = "thenameisbond";
      isValid = wrapper.instance().validate();
      expect(isValid).toBe(false);
      expect(wrapper.state("error")).toBe("code name and secret password are required");

      // nothing blank
      username.value = "doubleohseven";
      isValid = wrapper.instance().validate();
      expect(isValid).toBe(true);
      expect(wrapper.state("error")).toBe(null);
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
        validate = jest.genMockFunction();
        validate.mockReturnValue(true);
        wrapper.instance().validate = validate;
        form = wrapper.find("form");
        form.simulate("submit");
      });

      it("validates", () => {
        expect(validate.mock.calls.length).toBe(1);
      });

      it("saves credentials", () => {
        expect(saveCredentials.mock.calls.length).toBe(1);
        expect(saveCredentials.mock.calls[0][0]).toBe(credentials);
      });

      it("hides", () => {
        expect(hide.mock.calls.length).toBe(1);
      });

      it("executes callback", () => {
        expect(callback.mock.calls.length).toBe(1);
        expect(callback.mock.calls[0][0]).toBe(credentials);
      });
    });

    it("updates error from props", () => {
      wrapper.setProps(
        Object.assign({}, wrapper.props(), { error: "new error" })
      );
      expect(wrapper.state("error")).toBe("new error");
    });
  });
});