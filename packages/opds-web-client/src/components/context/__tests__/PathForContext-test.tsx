import * as React from "react";
import { expect } from "chai";

import * as PropTypes from "prop-types";
import { mount } from "enzyme";

import PathForProvider, { PathForContext } from "../PathForContext";
import { PathFor } from "../../../interfaces";

const pathFor: PathFor = (collectionUrl, bookUrl) => {
  return "path";
};

const WrappedPathForProvider = ({ children }) => {
  return <PathForProvider pathFor={pathFor}>{children}</PathForProvider>;
};

describe("PathForContext", () => {
  it("passes pathFor down via legacy API", () => {
    /**
     * unfortunately enzyme doesn't provide a clear way to test for
     * access to context via legacy or new api that I can find.
     * This is a somewhat hacky way to do it by testing for the context
     * in a custom child component and then putting text in the dom
     * which we will expect() on via enzyme. Not pretty, but it works.
     */

    const hasAccessProof = "does have access to context";

    class Child extends React.Component {
      static contextTypes = {
        pathFor: PropTypes.func.isRequired
      };
      render() {
        // here is the meat of the test
        const hasContext = this.context?.pathFor === pathFor;
        return (
          <div>
            {hasContext ? hasAccessProof : "doesn't have access to context"}
          </div>
        );
      }
    }
    let wrapper = mount(
      <WrappedPathForProvider>
        <Child />
      </WrappedPathForProvider>
    );

    expect(wrapper.text()).to.equal(hasAccessProof);
  });

  it("passes pathFor down via new API", () => {
    class Child extends React.Component {
      static contextType = PathForContext;
      render() {
        return <div>I should have access to context</div>;
      }
    }
    let wrapper = mount(<Child />, {
      wrappingComponent: WrappedPathForProvider
    });
    expect(wrapper.context()).to.equal(pathFor);
  });
});
