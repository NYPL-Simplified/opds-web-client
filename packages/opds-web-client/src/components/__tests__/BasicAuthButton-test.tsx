import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import { shallow } from "enzyme";

import BasicAuthButton from "../BasicAuthButton";
import BasicAuthPlugin from "../../BasicAuthPlugin";

describe("BasicAuthButton", () => {
  describe("rendering", () => {
    let wrapper, provider, onClick;

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
      onClick = stub();

      wrapper = shallow(
        <BasicAuthButton provider={provider} onClick={onClick} />
      );
    });

    it("shows input with provider name", () => {
      let input = wrapper.find("input");
      expect(input.prop("value")).to.contain(provider.method.description);
    });

    it("calls onClick", () => {
      let input = wrapper.find("input");
      input.simulate("click");
      expect(onClick.callCount).to.equal(1);
    });
  });
});
