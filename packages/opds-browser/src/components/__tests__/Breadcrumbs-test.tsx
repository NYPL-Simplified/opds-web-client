jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import Breadcrumbs from "../Breadcrumbs";
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
    expect(links.length).toBe(1);
    expect(links.at(0).props().children).toContain("2nd title");
    expect(links.at(0).props().collectionUrl).toEqual("2nd url");
    let current = wrapper.find(".currentCollection");
    expect(current.length).toBe(1);
    expect(current.text()).toBe("last title");
  });
});
