jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import Breadcrumbs, { hierarchyComputeBreadcrumbs } from "../Breadcrumbs";
import BrowserLink, { BrowserLinkProps } from "../BrowserLink";
import { ungroupedCollectionData } from "./collectionData";
import { LinkData } from "../../interfaces";

describe("Breadcrumbs", () => {
  let data: LinkData[];

  beforeEach(() => {
    data = [{
      id: "2nd id",
      text: "2nd title",
      url: "2nd url"
    }, {
      id: "last id",
      text: "last title",
      url: "last url"
    }];
  });

  it("shows links with bootstrap classes", () => {
    let wrapper = shallow(
      <Breadcrumbs links={data} />
    );

    let list = wrapper.find("ol");
    let links = wrapper.find(BrowserLink);
    expect(list.hasClass("breadcrumb")).toBe(true);
    expect(links.length).toBe(2);
    expect(links.at(0).props().children).toContain("2nd title");
    expect(links.at(0).props().collectionUrl).toEqual("2nd url");
    // last link is wrapped in <strong>
    expect((links.at(1).props().children as any).props.children).toContain("last title");
    expect(links.at(1).props().collectionUrl).toEqual("last url");
  });
});

describe("hierarchyComputeBreadcrumbs", () => {
  let collection = {
    id: "new id",
    url: "new url",
    title: "new title",
    lanes: [],
    books: [],
    links: []
  };
  let history = [];

  it("returns empty without root or uplink", () => {
    expect(hierarchyComputeBreadcrumbs(collection, history)).toEqual([]);
  });

  it("returns root if only root is present", () => {
    let catalogRootLink = {
      url: "new root url",
      text: "new root url"
    };
    let data = Object.assign({}, collection, { catalogRootLink });
    expect(hierarchyComputeBreadcrumbs(data, history)).toEqual([catalogRootLink]);
  });

  it("provides default catalog root title", () => {
    let catalogRootLink = {
      url: "new root url",
      text: null
    };
    let data = Object.assign({}, collection, { catalogRootLink });
    expect(hierarchyComputeBreadcrumbs(data, history)).toEqual([{
      url: catalogRootLink.url,
      text: "Catalog"
    }]);
  });

  it("returns uplink if only uplink is present", () => {
    let parentLink = {
      url: "new parent url",
      text: "new parent text"
    };
    let data = Object.assign({}, collection, { parentLink });
    expect(hierarchyComputeBreadcrumbs(data, history)).toEqual([parentLink]);
  });

  it("returns only root if uplink is same as root", () => {
    let catalogRootLink = {
      url: "new root url",
      text: "new root text"
    };
    let parentLink = {
      url: "new root url",
      text: "new root text"
    };
    let data = Object.assign({}, collection, { catalogRootLink, parentLink });
    expect(hierarchyComputeBreadcrumbs(data, history)).toEqual([catalogRootLink]);
  });
});
