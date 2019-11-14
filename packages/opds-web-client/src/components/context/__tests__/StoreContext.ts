import { expect } from "chai";
import { stub } from "sinon";
import * as React from "react";
import * as PropTypes from "prop-types";
import { shallow } from "enzyme";

import StoreContext from "../StoreContext";
import Root, { RootProps } from "../Root";
import { mockRouterContext } from "./routing";

class StoreChild extends React.Component {
  static childContextTypes = {
    store: PropTypes.object.isRequired,
  };
  render() {
    return "I should have access to context";
  }
}

describe("StoreContext", () => {
  let props = {
  };
  let context = mockRouterContext();

  it("creates a store if not given one", () => {
    let wrapper = shallow(
      <StoreContext {...props} />
    );
    let root = wrapper.find<RootProps>(Root);
    expect(root.props().store).to.be.ok;
  });

  it("passes store down via context", () => {
    let store = buildStore();
    let state = store.getState();
    let wrapper = shallow(
      <StoreContext {...props} initialState={state} />,
      { context,
        childContextTypes: {
          router: PropTypes.object,
          pathFor: PropTypes.func
        }
      }
    );
    let root = wrapper.find<RootProps>(Root);
    expect(root.props().store.getState()).to.deep.equal(state);
  });

  it("store is accessible via old context api", () => {
    let wrapper = shallow(
      <StoreContext {...props} />,
      { context,
        childContextTypes: {
          router: PropTypes.object,
          pathFor: PropTypes.func
        }
      }
    );
    let root = wrapper.find<RootProps>(Root);

    Object.keys(props).forEach(key => {
      expect(root.props()[key]).to.equal(props[key]);
    });
  });
});