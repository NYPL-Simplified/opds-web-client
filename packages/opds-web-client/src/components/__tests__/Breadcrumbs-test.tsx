import { expect } from "chai";

import * as React from "react";
import { shallow } from "enzyme";

import Breadcrumbs, { hierarchyComputeBreadcrumbs } from "../Breadcrumbs";
import CatalogLink, { CatalogLinkProps } from "../CatalogLink";
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
    let links = wrapper.find(CatalogLink);
    let currentLink = wrapper.find("ol li").last();
    expect(list.hasClass("breadcrumb")).to.equal(true);
    // The current page is no longer a link:
    expect(links.length).to.equal(1);
    expect(links.at(0).props().children).to.contain("2nd title");
    expect(links.at(0).props().collectionUrl).to.equal("2nd url");
    // last link is wrapped in <strong>
    expect(currentLink.text()).to.equal("last title");
  });
});

describe("hierarchyComputeBreadcrumbs", () => {
  let collection = {
    id: "new id",
    url: "new url",
    title: "new title",
    lanes: [],
    books: [],
    navigationLinks: []
  };
  let collectionLink = {
    url: "new url",
    text: "new title"
  };
  let history = [];

  it("returns only collection link without root or parent", () => {
    expect(hierarchyComputeBreadcrumbs(collection, history)).to.deep.equal([collectionLink]);
  });

  it("returns root and collection if parent not present", () => {
    let catalogRootLink = {
      url: "new root url",
      text: "new root url"
    };
    let data = Object.assign({}, collection, { catalogRootLink });
    expect(hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([catalogRootLink, collectionLink]);
  });

  it("provides default catalog root title", () => {
    let catalogRootLink = {
      url: "new root url",
      text: null
    };
    let data = Object.assign({}, collection, { catalogRootLink });
    expect(hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([{
      url: catalogRootLink.url,
      text: "Catalog"
    }, collectionLink]);
  });

  it("returns only parent and collection if root not present", () => {
    let parentLink = {
      url: "new parent url",
      text: "new parent text"
    };
    let data = Object.assign({}, collection, { parentLink });
    expect(hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([parentLink, collectionLink]);
  });

  it("returns only root and collection if parent is same as root", () => {
    let catalogRootLink = {
      url: "new root url",
      text: "new root text"
    };
    let parentLink = {
      url: "new root url",
      text: "new root text"
    };
    let data = Object.assign({}, collection, { catalogRootLink, parentLink });
    expect(hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([catalogRootLink, collectionLink]);
  });

  it("return only parent and collection if collection is same as root", () => {
    let catalogRootLink = {
      url: "new url",
      text: "new title"
    };
    let parentLink = {
      url: "new parent url",
      text: "new parent text"
    };
    let data = Object.assign({}, collection, { catalogRootLink, parentLink });
    expect(hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([parentLink , collectionLink]);
  });

  it("return only root and parent if collection is same as parent", () => {
    let catalogRootLink = {
      url: "new root url",
      text: "new root text"
    };
    let parentLink = {
      url: "new url",
      text: "new title"
    };
    let data = Object.assign({}, collection, { catalogRootLink, parentLink });
    expect(hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([catalogRootLink, parentLink]);
  });

  it("uses a custom comparator if passed one", () => {
    let catalogRootLink = {
      url: "new root url",
      text: "new root text"
    };
    let data = Object.assign({}, collection, { catalogRootLink });

    // no comparator
    expect(hierarchyComputeBreadcrumbs(data, history)).to.deep.equal([catalogRootLink, collectionLink]);

    // comparator that says links are equal
    let comparator = (url1, url2) => true;
    expect(hierarchyComputeBreadcrumbs(data, history, comparator)).to.deep.equal([collectionLink]);

    // comparator that says links are not equal
    comparator = (url1, url2) => false;
    expect(hierarchyComputeBreadcrumbs(data, history, comparator)).to.deep.equal([catalogRootLink, collectionLink]);
  });
});
