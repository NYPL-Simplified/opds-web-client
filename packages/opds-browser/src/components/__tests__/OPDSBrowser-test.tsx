jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import OPDSBrowser from "../OPDSBrowser";
import Root, { RootProps } from "../Root";
import buildStore from "../../store";

describe("OPDSBrowser", () => {
  let props = {
    collectionUrl: "collection url",
    bookUrl: "book url",
    proxyUrl: "proxy url",
    navigate: jest.genMockFunction(),
    pathFor: (collectionUrl: string, bookUrl: string): string => { return "path"; },
    bookData: {
      id: "book id",
      title: "book title",
      url: "book url"
    },
    pageTitleTemplate: (c, b) => "test title"
  };

  it("creates a store for Root if not given one", () => {
    let wrapper = shallow(
      <OPDSBrowser {...props} />
    );
    let root = wrapper.find<RootProps>(Root);
    expect(root.props().store).toBeTruthy();
  });

  it("passes store to Root if given one", () => {
    let store = buildStore();
    let wrapper = shallow(
      <OPDSBrowser {...props} store={store} />
    );
    let root = wrapper.find<RootProps>(Root);
    expect(root.props().store).toBe(store);
  });

  it("passes props to Root", () => {
    let wrapper = shallow(
      <OPDSBrowser {...props} />
    );
    let root = wrapper.find<RootProps>(Root);

    Object.keys(props).forEach(key => {
      expect(root.props()[key]).toEqual(props[key]);
    });
  });
});