jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import Breadcrumbs from "../Breadcrumbs";
import BrowserLink, { BrowserLinkProps } from "../BrowserLink";
import { ungroupedCollectionData } from "./collectionData";
import { LinkData } from "../../interfaces";

describe("Breadcrumbs", () => {
  let history: LinkData[];
  let collectionData = ungroupedCollectionData;
  let bookData = collectionData.books[0];

  beforeEach(() => {
    history = [{
      id: "2nd id",
      text: "2nd title",
      url: "2nd url"
    }, {
      id: "last id",
      text: "last title",
      url: "last url"
    }];
  });

  it("shows breadcrumbs with bootstrap classes", () => {
    let wrapper = shallow(
      <Breadcrumbs
        BrowserLink={BrowserLink}
        history={history}
        hierarchy={[]}
        collection={collectionData}
        book={null}
        />
    );

    let list = wrapper.find("ol");
    let links = wrapper.find<BrowserLinkProps>(BrowserLink);
    expect(list.hasClass("breadcrumb")).toBe(true);
    expect(links.length).toBe(2);
    expect(links.at(0).props().children).toContain("2nd title");
    expect(links.at(0).props().collectionUrl).toEqual("2nd url");
    expect(links.at(1).props().children).toContain("last title");
    expect(links.at(1).props().collectionUrl).toEqual("last url");
  });

  it("links to current selection if specified", () => {
    let wrapper = shallow(
      <Breadcrumbs
        BrowserLink={BrowserLink}
        history={history}
        hierarchy={[]}
        collection={collectionData}
        book={bookData}
        />
    );

    let links = wrapper.find<BrowserLinkProps>(BrowserLink);
    let lastLink = links.last();
    expect(links.length).toBe(history.length + 1);
    expect(lastLink.props().children).toContain(collectionData.title);
    expect(lastLink.props().collectionUrl).toBe(collectionData.url);
    expect(lastLink.hasClass("currentCollectionLink")).toBe(true);
  });
});
