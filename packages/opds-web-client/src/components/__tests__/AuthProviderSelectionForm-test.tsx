import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import { shallow, mount } from "enzyme";

import AuthProviderSelectionForm from "../AuthProviderSelectionForm";
import BasicAuthPlugin from "../../BasicAuthPlugin";
import BasicAuthForm from "../BasicAuthForm";
import BasicAuthButton from "../BasicAuthButton";

describe("AuthProviderSelectionForm", () => {
  let provider1, provider2;

  beforeEach(() => {
    provider1 = {
      id: "Provider 1",
      plugin: BasicAuthPlugin,
      method: {
        labels: {
          login: "login 1",
          password: "password 1"
        }
      }
    };

    provider2 = {
      id: "Provider 2",
      plugin: BasicAuthPlugin,
      method: {
        labels: {
          login: "login 2",
          password: "password 2"
        }
      }
    };
  });

  describe("with one provider", () => {
    let wrapper;
    let hide;
    let saveCredentials;
    let cancel;

    beforeEach(() => {
      hide = stub();
      saveCredentials = stub();
      cancel = stub();

      wrapper = shallow(
        <AuthProviderSelectionForm
          hide={hide}
          saveCredentials={saveCredentials}
          cancel={cancel}
          title="Intergalactic Spy Network"
          error="you forgot the secret password! what kind of spy arre you?"
          providers={[provider1]}
        />
      );
    });

    describe("rendering", () => {
      it("shows title", () => {
        let title = wrapper.find("h3");
        expect(title.text()).to.equal("Intergalactic Spy Network Login");
      });

      it("shows auth form for the provider", () => {
        let form = wrapper.find(BasicAuthForm);
        expect(form.length).to.equal(1);
        expect(form.props().provider).to.deep.equal(provider1);
        expect(form.props().hide).to.equal(hide);
        expect(form.props().cancel).to.equal(cancel);
        expect(form.props().saveCredentials).to.equal(saveCredentials);
        expect(form.props().error).to.equal(
          "you forgot the secret password! what kind of spy arre you?"
        );
      });

      it("does not show provider selection button", () => {
        let button = wrapper.find(BasicAuthButton);
        expect(button.length).to.equal(0);
      });

      it("does not show cancel button", () => {
        let button = wrapper.find("button");
        expect(button.length).to.equal(0);
      });
    });
  });

  describe("with two providers", () => {
    let wrapper;
    let hide;
    let saveCredentials;
    let cancel;

    beforeEach(() => {
      hide = stub();
      saveCredentials = stub();
      cancel = stub();

      wrapper = mount(
        <AuthProviderSelectionForm
          hide={hide}
          saveCredentials={saveCredentials}
          cancel={cancel}
          title="Intergalactic Spy Network"
          error="you forgot the secret password! what kind of spy arre you?"
          providers={[provider1, provider2]}
        />
      );
    });

    describe("rendering", () => {
      it("shows title", () => {
        let title = wrapper.find("h3");
        expect(title.text()).to.equal("Intergalactic Spy Network Login");
      });

      it("shows auth buttons for both providers", () => {
        let buttons = wrapper.find(BasicAuthButton);
        expect(buttons.length).to.equal(2);
        expect(buttons.at(0).props().provider).to.deep.equal(provider1);
        expect(buttons.at(1).props().provider).to.deep.equal(provider2);
      });

      it("shows cancel button", () => {
        let button = wrapper.find("button");
        expect(button.length).to.equal(1);
      });
    });

    describe("behavior", () => {
      it("selects a provider", () => {
        expect(wrapper.state().selectedProvider).to.be.null;
        let buttons = wrapper.find(BasicAuthButton);
        buttons.at(1).simulate("click");
        expect(wrapper.state().selectedProvider).to.equal(provider2);
      });

      it("shows auth form for selected provider", () => {
        wrapper.setState({ selectedProvider: provider1 });
        wrapper.update();
        let form = wrapper.find(BasicAuthForm);
        expect(form.length).to.equal(1);
        expect(form.props().provider).to.deep.equal(provider1);
        expect(form.props().hide).to.equal(hide);
        expect(form.props().cancel).to.equal(cancel);
        expect(form.props().saveCredentials).to.equal(saveCredentials);
        expect(form.props().error).to.equal(
          "you forgot the secret password! what kind of spy arre you?"
        );
      });

      it("selects previously attempted provider if there was an error", () => {
        wrapper = mount(
          <AuthProviderSelectionForm
            hide={hide}
            saveCredentials={saveCredentials}
            cancel={cancel}
            title="Intergalactic Spy Network"
            error="you forgot the secret password! what kind of spy arre you?"
            attemptedProvider="Provider 2"
            providers={[provider1, provider2]}
          />
        );
        expect(wrapper.state().selectedProvider).to.equal(provider2);
      });
    });
  });
});
