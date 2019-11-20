import * as React from "react";
import { expect } from "chai";
import { stub } from "sinon";

import * as PropTypes from "prop-types";
import { shallow } from "enzyme";

import buildStore from "../../../store";

import StoreContext from "../StoreContext";
import PathForProvider from "../PathForContext";
import { PathFor } from "../../../interfaces";
// import { mockRouterContext } from "../../../routing";

/**
 *  Testing the StoreContext component. Based on old OPDSCatalog Tests
 *    - if not given state, it will build state on its own (seems like this should be a test of buildState maybe?)
 *    - if given a state, it will use it and pass it down.
 *    - passes props down
 *    - test that the context really is available through old and new APIs (and it's the same?)
 *
 *    * pathFor must be available in context. Use the pathForProvider to wrap tests
 */

const Wrapper = ({ children }) => {
  const pathFor: PathFor = (collectionUrl, bookUrl) => {
    return "path";
  };

  return <div>hi</div>;
};

describe("StoreContext", () => {
  let props = {
    collectionUrl: "collection url",
    bookUrl: "book url",
    proxyUrl: "proxy url",
    navigate: stub(),
    pathFor: (collectionUrl: string, bookUrl: string): string => {
      return "path";
    },
    bookData: {
      id: "book id",
      title: "book title",
      url: "book url"
    },
    pageTitleTemplate: (c, b) => "test title",
    epubReaderUrlTemplate: a => "test reader url"
  };
  // let context = mockRouterContext();

  it("passes context down via legacy API", () => {
    let wrapper = shallow(<OPDSCatalog {...props} />, {
      context,
      childContextTypes: {
        router: PropTypes.object,
        pathFor: PropTypes.func
      }
    });
    let root = wrapper.find<RootProps>(Root);
    expect(root.props().store).to.be.ok;
  });

  it("passes context down via new API", () => {});

  it("creates a new state if not given one", () => {});

  it("uses provided state if given one", () => {});

  it("forwards props to children/Root", () => {});

  it("passes state to Root if given one", () => {
    let store = buildStore();
    let state = store.getState();
    let wrapper = shallow(<OPDSCatalog {...props} initialState={state} />, {
      context,
      childContextTypes: {
        router: PropTypes.object,
        pathFor: PropTypes.func
      }
    });
    let root = wrapper.find<RootProps>(Root);
    expect(root.props().store.getState()).to.deep.equal(state);
  });

  it("passes props to Root", () => {
    let wrapper = shallow(<OPDSCatalog {...props} />, {
      context,
      childContextTypes: {
        router: PropTypes.object,
        pathFor: PropTypes.func
      }
    });
    let root = wrapper.find<RootProps>(Root);

    Object.keys(props).forEach(key => {
      expect(root.props()[key]).to.equal(props[key]);
    });
  });
});
