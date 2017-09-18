import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import { shallow } from "enzyme";

import OPDSCatalog from "../OPDSCatalog";
import Root, { RootProps } from "../Root";
import buildStore from "../../store";
import { State } from "../../state";
import { groupedCollectionData } from "./collectionData";
import { jsdom } from "jsdom";

describe("OPDSCatalog", () => {
  let props = {
    collectionUrl: "collection url",
    bookUrl: "book url",
    proxyUrl: "proxy url",
    navigate: stub(),
    pathFor: (collectionUrl: string, bookUrl: string): string => { return "path"; },
    bookData: {
      id: "book id",
      title: "book title",
      url: "book url"
    },
    pageTitleTemplate: (c, b) => "test title",
    epubReaderUrlTemplate: (a) => "test reader url"
  };

  it("creates a store for Root if not given one", () => {
    let wrapper = shallow(
      <OPDSCatalog {...props} />
    );
    let root = wrapper.find<RootProps>(Root);
    expect(root.props().store).to.be.ok;
  });

  it("passes state to Root if given one", () => {
    let store = buildStore();
    let state = store.getState();
    let wrapper = shallow(
      <OPDSCatalog {...props} initialState={state} />
    );
    let root = wrapper.find<RootProps>(Root);
    expect(root.props().store.getState()).to.deep.equal(state);
  });

  it("passes props to Root", () => {
    let wrapper = shallow(
      <OPDSCatalog {...props} />
    );
    let root = wrapper.find<RootProps>(Root);

    Object.keys(props).forEach(key => {
      expect(root.props()[key]).to.equal(props[key]);
    });
  });
});