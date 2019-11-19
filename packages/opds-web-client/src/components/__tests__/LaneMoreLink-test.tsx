import { expect } from "chai";

import * as React from "react";
import { shallow } from "enzyme";

import LaneMoreLink from "../LaneMoreLink";
import CatalogLink from "../CatalogLink";

let bookData = {
  id: "test id",
  url: "test url",
  title: "test title",
  authors: ["test author"],
  summary: "test summary",
  imageUrl: "https://example.com/testimage",
  publisher: "test publisher"
};

let laneData = {
  title: "test lane",
  books: [bookData],
  url: "http://example.com/testlane"
};

describe("LaneMoreLink", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<LaneMoreLink lane={laneData} />);
  });

  it("shows CatalogLink pointing to lane url", () => {
    let link = wrapper.find(CatalogLink);
    expect(link.prop("collectionUrl")).to.equal(laneData.url);
    expect(link.children().text()).to.equal("More" + laneData.title); // text() ignores line break
  });
});
