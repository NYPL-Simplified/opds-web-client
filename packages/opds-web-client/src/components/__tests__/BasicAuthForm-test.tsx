import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import { shallow, mount } from "enzyme";

import BasicAuthForm from "../BasicAuthForm";
import BasicAuthPlugin from "../../BasicAuthPlugin";
import { generateCredentials } from "../../utils/auth";

describe("BasicAuthForm", () => {
  describe("rendering", () => {
    let wrapper, provider;

    beforeEach(() => {
      provider = {
        id: "id",
        plugin: BasicAuthPlugin,
        method: {
          description: "Test Basic Auth",
          labels: {
            login: "code name",
            password: "secret password"
          }
        }
      };

      wrapper = shallow(
        <BasicAuthForm
          hide={stub()}
          saveCredentials={stub()}
          cancel={stub()}
          error="you forgot the secret password! what kind of spy arre you?"
          provider={provider}
        />
      );
    });

    it("shows username input", () => {
      let input = wrapper.find("input").at(0);
      expect(input.prop("aria-label")).to.equal("Input for code name");
    });

    it("shows password input", () => {
      let input = wrapper.find("input").at(1);
      expect(input.prop("aria-label")).to.equal("Input for secret password");
    });

    it("shows submit button", () => {
      let input = wrapper.find("input[type='submit']");
      expect(input.prop("value")).to.equal("Submit");
    });

    it("shows cancel button", () => {
      let button = wrapper.find("input[type='reset']");
      expect(button.prop("value")).to.equal("Cancel");
    });

    it("shows error", () => {
      let error = wrapper.find(".auth-error");
      expect(error.text()).to.equal(
        "you forgot the secret password! what kind of spy arre you?"
      );
    });
  });

  describe("behavior", () => {
    let wrapper;
    let provider;
    let hide;
    let saveCredentials;
    let callback;
    let cancel;

    beforeEach(() => {
      hide = stub();
      saveCredentials = stub();
      callback = stub();
      cancel = stub();

      provider = {
        id: "id",
        plugin: BasicAuthPlugin,
        method: {
          description: "Test Basic Auth",
          labels: {
            login: "code name",
            password: "secret password"
          }
        }
      };

      wrapper = mount(
        <BasicAuthForm
          hide={hide}
          saveCredentials={saveCredentials}
          callback={callback}
          cancel={cancel}
          error="you forgot the secret password! what kind of spy arre you?"
          provider={provider}
        />
      );
    });

    it("validates", () => {
      // both fields blank
      let isValid = wrapper.instance().validate();
      expect(isValid).to.equal(false);
      expect(wrapper.state("error")).to.equal("code name is required");

      // username blank
      let username = wrapper.find("input[type='text']").getDOMNode();
      username.value = "";
      let password = wrapper.find("input[type='password']").getDOMNode();
      password.value = "thenameisbond";
      isValid = wrapper.instance().validate();
      expect(isValid).to.equal(false);
      expect(wrapper.state("error")).to.equal("code name is required");

      // // nothing blank
      username.value = "doubleohseven";
      isValid = wrapper.instance().validate(username.value);
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
        username = wrapper.find("input[type='text']").getDOMNode();
        username.value = "doubleohseven";
        password = wrapper.find("input[type='password']").getDOMNode();
        password.value = "thenameisbond";
        credentials = generateCredentials("doubleohseven", "thenameisbond");
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
        expect(saveCredentials.args[0][0]).to.deep.equal({
          provider: "id",
          credentials: credentials
        });
      });

      it("hides", () => {
        expect(hide.callCount).to.equal(1);
      });

      it("executes callback", () => {
        expect(callback.callCount).to.equal(1);
      });
    });

    it("updates error from props", () => {
      wrapper.setProps(
        Object.assign({}, wrapper.props(), { error: "new error" })
      );
      expect(wrapper.state("error")).to.equal("new error");
    });

    it("cancels", () => {
      let cancelButton = wrapper.find("input[type='reset']");
      cancelButton.simulate("click");
      expect(cancel.callCount).to.equal(1);
    });
  });
});
