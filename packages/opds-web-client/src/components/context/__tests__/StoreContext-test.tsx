import * as React from "react";
import { expect } from "chai";
import { stub } from "sinon";

import * as PropTypes from "prop-types";
import { shallow, mount } from "enzyme";
import { ReactReduxContext } from "react-redux";

import buildStore from "../../../store";

import StoreContextProvider from "../StoreContext";
import PathForProvider from "../PathForContext";
import { PathFor } from "../../../interfaces";
import { isNull } from "util";
// import { mockRouterContext } from "../../../routing";

/**
 *  Testing the StoreContext component. Based on old OPDSCatalog Tests
 *    - if not given state, it will build state on its own
 *      (seems like this should be a test of buildStore maybe?)
 *    - if given a state, it will use it and pass it down.
 *    - passes props down
 *    - test that the context really is available through old and new APIs (and it's the same?)
 *
 *    * pathFor must be available in context. Use the pathForProvider to wrap tests
 */

const pathFor: PathFor = (collectionUrl, bookUrl) => {
  return "path";
};

const PathForContext = ({ children }) => {
  return <PathForProvider pathFor={pathFor}>{children}</PathForProvider>;
};

describe("StoreContext", () => {
  const props = {
    initialState: undefined,
    authPlugins: undefined
  };

  class Child extends React.Component {
    static contextType = ReactReduxContext;
    render() {
      return <div>I should have access to context</div>;
    }
  }

  // provide it as a wrapping component to the test
  const CombinedContext = ({ children, ...otherProps }) => (
    <PathForContext>
      <StoreContextProvider {...props} {...otherProps}>
        {children}
      </StoreContextProvider>
    </PathForContext>
  );

  it("passes store down via new API", () => {
    let wrapper = mount(<Child />, { wrappingComponent: CombinedContext });

    // now we need to see if child has access to context via new api
    expect(wrapper.context().store).to.be.ok;
    expect(wrapper.context().store).to.have.property("dispatch");
  });

  it("creates a new store if not given a state", () => {
    let wrapper = mount(<Child />, { wrappingComponent: CombinedContext });

    // now we need to see if child has access to context via new api
    expect(wrapper.context().store).to.be.ok;
    expect(wrapper.context().store).to.have.property("dispatch");
  });

  it("uses provided state if given one", () => {
    // set up an initial state
    let store = buildStore();
    let state = store.getState();

    let wrapper = mount(<Child />, {
      // pass the initial state in to the context wrapper
      wrappingComponent: ({ children }) => (
        <CombinedContext initialState={state}>{children}</CombinedContext>
      )
    });

    // check that the store state equals passed in state
    expect(wrapper.context().store).to.be.ok;
    expect(wrapper.context().store.getState()).to.deep.equal(state);
  });
});
