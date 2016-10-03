import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import { shallow, mount } from "enzyme";

import BasicAuthButton from "../BasicAuthButton";
import BasicAuthPlugin from "../../BasicAuthPlugin";

describe("BasicAuthButton", () => {
  describe("rendering", () => {
    let wrapper, provider;

    beforeEach(() => {
      provider = {
        name: "Test Basic Auth",
        plugin: BasicAuthPlugin,
        method: {
          labels: {
            login: "code name",
            password: "secret password"
          }
        }
      };

      wrapper = shallow(
        <BasicAuthButton
          provider={provider}
          />
      );
    });

    it("shows input with provider name", () => {
      let input = wrapper.find("input");
      expect(input.prop("value")).to.contain(provider.name);
    });
  });
});