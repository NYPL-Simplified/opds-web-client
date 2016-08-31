import { expect } from "chai";

import * as React from "react";
import { shallow } from "enzyme";

import Lane from "../Lane";
import LaneBook from "../LaneBook";
import CatalogLink from "../CatalogLink";
import LaneMoreLink from "../LaneMoreLink";
import { LaneData, BookData } from "../../interfaces";

let books: BookData[] = [1, 2, 3].map((i) => {
  return {
    id: `test book id ${i}`,
    title: `test book title ${i}`,
    authors: [`test author ${i}`],
    summary: `test summary ${i}`,
    imageUrl: `https://example.com/testimage${i}`,
    publisher: `test publisher ${i}`
  };
});
let laneData: LaneData = {
  title: "test lane",
  books: books,
  url: "http://example.com/testlane"
};

describe("Lane", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Lane lane={laneData} collectionUrl="test collection" />
    );
  });

  it("shows the lane title in a CatalogLink", () => {
    let titleLink = wrapper.find(CatalogLink);
    expect(titleLink.first().children().get(0)).to.equal(laneData.title);
  });

  it("shows LaneBooks", () => {
    let laneBooks = wrapper.find(LaneBook);
    let bookDatas = laneBooks.map(book => book.props().book);
    let uniqueCollectionUrls = Array.from(new Set(laneBooks.map(book => book.props().collectionUrl)));

    expect(laneBooks.length).to.equal(books.length);
    expect(bookDatas).to.deep.equal(books);
    expect(uniqueCollectionUrls).to.deep.equal(["test collection"]);
  });

  it("shows more link", () => {
    let moreLink = wrapper.find(LaneMoreLink);
    expect(moreLink.prop("lane")).to.equal(laneData);
  });

  it("hides more link", () => {
    wrapper.setProps({ hideMoreLink: true });
    let moreLink = wrapper.find(LaneMoreLink);
    expect(moreLink.length).to.equal(0);
  });

  it("hides books by id", () => {
    wrapper.setProps({ hiddenBookIds: ["test book id 1"] });
    let laneBooks = wrapper.find(LaneBook);
    expect(laneBooks.length).to.equal(books.length - 1);
    expect(laneBooks.at(0).props().book).to.equal(books[1]);
  });
});