import * as React from "react";
import { expect } from "chai";
import { stub } from "sinon";

import * as PropTypes from "prop-types";
import { shallow, mount } from "enzyme";

import { Router } from "../../../interfaces";
import RouterProvider, { RouterContext } from "../RouterContext";
import { mockRouter } from "../../../__mocks__/routing";

const router: Router = mockRouter(stub());

const WrappedRouterProvider = ({ children }) => {
  return <RouterProvider router={router}>{children}</RouterProvider>;
};

describe("RouterContext", () => {
  it("passes router down via legacy API", () => {
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
        router: PropTypes.object.isRequired
      };
      render() {
        // here is the meat of the test
        const hasRouterContext = this.context?.router === router;
        return (
          <div>
            {hasRouterContext
              ? hasAccessProof
              : "doesn't have access to context"}
          </div>
        );
      }
    }
    let wrapper = mount(
      <WrappedRouterProvider>
        <Child />
      </WrappedRouterProvider>
    );

    expect(wrapper.text()).to.equal(hasAccessProof);
  });

  it("passes pathFor down via new API", () => {
    class Child extends React.Component {
      static contextType = RouterContext;
      render() {
        return <div>I should have access to context</div>;
      }
    }
    let wrapper = mount(<Child />, {
      wrappingComponent: WrappedRouterProvider
    });
    expect(wrapper.context()).to.deep.equal(router);
  });
});
