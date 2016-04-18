jest.dontMock("../Breadcrumbs");
jest.dontMock("./routing");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import Breadcrumbs from "../Breadcrumbs";
import BrowserLink from "../BrowserLink";
import { ungroupedCollectionData } from "./collectionData";
import { LinkData } from "../../interfaces";
import withRouterContext from "./routing";

describe("Breadcrumbs", () => {
  let history: LinkData[];
  let collectionData = ungroupedCollectionData;

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
    let breadcrumbs = TestUtils.renderIntoDocument(
      <Breadcrumbs collection={collectionData} history={history} />
    ) as Breadcrumbs;

    let list = TestUtils.findRenderedDOMComponentWithTag(breadcrumbs, "ol");
    let links = TestUtils.scryRenderedComponentsWithType<BrowserLink, any>(breadcrumbs, BrowserLink);
    expect(list.getAttribute("class")).toBe("breadcrumb");
    expect(links[0].props.children).toContain("2nd title");
    expect(links[0].props.collectionUrl).toEqual("2nd url");
    expect(links[1].props.children).toContain("last title");
    expect(links[1].props.collectionUrl).toEqual("last url");
  });

  it("links to current selection if specified", () => {
    let breadcrumbs = TestUtils.renderIntoDocument(
      <Breadcrumbs
        collection={collectionData}
        history={history}
        showCurrentLink={true} />
    ) as Breadcrumbs;

    let links = TestUtils.scryRenderedComponentsWithType<BrowserLink, any>(breadcrumbs, BrowserLink);
    let lastLink = links[links.length - 1];
    expect(links.length).toBe(history.length + 1);
    expect(lastLink.props.collectionUrl).toBe(collectionData.url);
    expect(lastLink.props.className).toBe("currentCollectionLink");
  });
});
