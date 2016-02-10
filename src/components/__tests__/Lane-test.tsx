jest.dontMock("../Lane");
jest.dontMock("../CollectionLink");
jest.dontMock("../Book");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import Lane from "../Lane";
import CollectionLink from "../CollectionLink";
import Book from "../Book";

let books: BookProps[] = [1, 2, 3].map((i) => {
  return {
    id: `test book id ${i}`,
    title: `test book title ${i}`,
    authors: [`test author ${i}`],
    summary: `test summary ${i}`,
    imageUrl: `https://example.com/testimage${i}`,
    publisher: `test publisher ${i}`
  }
});
let laneProps: LaneProps = {
  title: "test lane",
  books: books,
  url: "http://example.com/testlane"
};

describe("Lane", () => {
  it("shows the lane title", () => {
    let lane = TestUtils.renderIntoDocument(
      <Lane {...laneProps} />
    );

    let titleLink = TestUtils.findRenderedDOMComponentWithClass(lane, "laneTitle");
    expect(titleLink.textContent).toBe(laneProps.title);
  });

  it("shows the books", () => {
    let lane = TestUtils.renderIntoDocument(
      <Lane {...laneProps} />
    );

    let books = TestUtils.scryRenderedComponentsWithType(lane, Book);
    expect(books.length).toBe(books.length);
  });
});