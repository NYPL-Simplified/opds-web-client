jest.dontMock("../Breadcrumbs");
jest.dontMock("../CollectionLink");
jest.dontMock("../Link");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import Breadcrumbs from "../Breadcrumbs";
import CollectionLink from "../CollectionLink";
import { ungroupedCollectionData } from "./collectionData";

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

  it("shows breadcrumbs", () => {
    let breadcrumbs = TestUtils.renderIntoDocument(
      <Breadcrumbs collection={collectionData} history={history} />
    );

    let links = TestUtils.scryRenderedComponentsWithType(breadcrumbs, CollectionLink);
    expect(links[0].props.text).toContain("2nd title");
    expect(links[0].props.url).toEqual("2nd url");
    expect(links[1].props.text).toContain("last title");
    expect(links[1].props.url).toEqual("last url");
  });

  it("links to current selection if specified", () => {
    let pathFor = (collection, book) => {
      return `path for ${collection} and ${book}`;
    };
    let breadcrumbs = TestUtils.renderIntoDocument(
      <Breadcrumbs
        collection={collectionData}
        history={history}
        pathFor={pathFor}
        showCurrentLink={true} />
    );

    let currentLink = TestUtils.findRenderedDOMComponentWithClass(breadcrumbs, "currentCollectionLink");
    expect(currentLink.textContent).toBe(collectionData.title);
    expect(currentLink.getAttribute("href")).toBe(pathFor(collectionData.url, null));
  });
});
