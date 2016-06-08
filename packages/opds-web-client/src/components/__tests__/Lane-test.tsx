jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import Lane from "../Lane";
import LaneBook from "../LaneBook";
import CatalogLink from "../CatalogLink";
import BookCover from "../BookCover";
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
  it("shows the lane title in a CatalogLink", () => {
    let wrapper = shallow(
      <Lane lane={laneData} />
    );

    let titleLink = wrapper.find(CatalogLink);
    expect(titleLink.first().children().get(0)).toBe(laneData.title);
  });

  it("shows LaneBooks", () => {
    let wrapper = shallow(
      <Lane lane={laneData} collectionUrl="test collection" />
    );

    let laneBooks = wrapper.find(LaneBook);
    let bookDatas = laneBooks.map(book => book.props().book);
    let uniqueCollectionUrls = Array.from(new Set(laneBooks.map(book => book.props().collectionUrl)));

    expect(laneBooks.length).toBe(books.length);
    expect(bookDatas).toEqual(books);
    expect(uniqueCollectionUrls).toEqual(["test collection"]);
  });

  it("shows more link", () => {
    let wrapper = shallow(
      <Lane lane={laneData} collectionUrl="test collection" />
    );

    let moreLink = wrapper.find(CatalogLink).filter(".moreLink");
    expect(moreLink.prop("collectionUrl")).toBe(laneData.url);

    let cover = wrapper.find(BookCover);
    expect(cover.prop("text")).toBe("More " + laneData.title);
  });
});