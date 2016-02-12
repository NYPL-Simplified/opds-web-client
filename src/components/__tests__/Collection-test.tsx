jest.dontMock("../Collection");
jest.dontMock("../Lane");
jest.dontMock("../Book");
jest.dontMock("../LaneBook");
jest.dontMock("../Link");
jest.dontMock("../CollectionLink");
jest.dontMock("../FacetGroup");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import Collection from "../Collection";
import Lane from "../Lane";
import Book from "../Book";
import LaneBook from "../LaneBook";
import FacetGroup from "../FacetGroup";
import { groupedCollectionData, ungroupedCollectionData } from "./collectionData";

describe("Collection", () => {
  describe("collection with lanes", () => {
    let collectionData: CollectionProps = groupedCollectionData;
    let collection;

    beforeEach(() => {
      collection = TestUtils.renderIntoDocument(
        <Collection {...collectionData} />
      );
    });

    it("shows the collection title", () => {
      let titleElement = TestUtils.findRenderedDOMComponentWithTag(collection, "h1");
      expect(titleElement.textContent).toEqual(collectionData.title);
    });

    it("shows books", () => {
      let books = TestUtils.scryRenderedComponentsWithType(collection, Book);
      let bookCount = collectionData.lanes.reduce((count, lane) => {
        return count + lane.books.length;
      }, 0);
      expect(books.length).toEqual(bookCount);
    });

    it("shows lanes in order", () => {
      let lanes = TestUtils.scryRenderedComponentsWithType(collection, Lane);
      expect(lanes.length).toEqual(collectionData.lanes.length);
    });

    it("shows lanes in order", () => {
      let lanes = TestUtils.scryRenderedComponentsWithType(collection, Lane);
      let laneTitles = lanes.map(lane => lane.props.title);
      expect(laneTitles).toEqual(collectionData.lanes.map(lane => lane.title));
    });
  });

  describe("collection without lanes", () => {
    let collectionData = ungroupedCollectionData;
    let collection;

    beforeEach(() => {
      collection = TestUtils.renderIntoDocument(
        <Collection {...collectionData} />
      );
    });

    it("shows books", () => {
      let collection = TestUtils.renderIntoDocument(
        <Collection {...collectionData} />
      );
      let books: LaneBook[] = TestUtils.scryRenderedComponentsWithType(collection, LaneBook);
      // count books in all lanes plus books directly belonging to this collection
      let bookCount = collectionData.lanes.reduce((count, lane) => {
        return count + lane.books.length;
      }, collectionData.books.length);
      expect(books.length).toEqual(bookCount);
    });

    it("shows books in order", () => {
      let collection = TestUtils.renderIntoDocument(
        <Collection {...collectionData} />
      );
      let books: Book[] = TestUtils.scryRenderedComponentsWithType(collection, Book);
      let bookTitles = books.map(book => book.props.title);
      expect(bookTitles).toEqual(collectionData.books.map(book => book.title));
    });
  });

  describe("collection without facetGroups", () => {
    it("shows facet groups", () => {
      let collectionData = {
        id: "test collection",
        url: "test url",
        title: "title",
        books: [],
        lanes: [],
        links: [],
        facetGroups: [{
          label: "group",
          facets: []
        }]
      };

      let collection = TestUtils.renderIntoDocument(
        <Collection {...collectionData} />
      );
      let facetGroups: FacetGroup[] = TestUtils.scryRenderedComponentsWithType(collection, FacetGroup);
      expect(facetGroups.length).toEqual(1);
    });

  });

  describe("collection with next page", () => {
    it("fetches next page on scroll to bottom", () => {
      let fetchPage = jest.genMockFunction();
      let collectionData = {
        id: "test collection",
        url: "test url",
        title: "title",
        books: [],
        lanes: [],
        links: [],
        nextPageUrl: "next",
        fetchPage: fetchPage
      };

      let collection = TestUtils.renderIntoDocument(
        <Collection {...collectionData} />
      );

      document.body.scrollTop = 1000;
      document.body.scrollHeight = 1;
      window.dispatchEvent(new (window as any).UIEvent("scroll", {detail: 0}));

      expect(fetchPage.mock.calls.length).toEqual(1);
      expect(fetchPage.mock.calls[0][0]).toEqual("next");
    });

    it("shows loading indicator for next page", () => {
      let collectionData = {
        id: "test collection",
        url: "test url",
        title: "title",
        books: [],
        lanes: [],
        links: [],
        isFetchingPage: true
      };

      let collection = TestUtils.renderIntoDocument(
        <Collection {...collectionData} />
      );

      let loading = TestUtils.findRenderedDOMComponentWithClass(collection, "loadingNextPage");
      expect(loading.textContent).toContain("Loading");
    });
  });

  describe("collection that scrolls", () => {
    let collectionData = {
      id: "test collection",
      url: "test url",
      title: "title",
      books: [],
      lanes: [],
      links: []
    };
    let collection;
    let node;

    beforeEach(() => {
      node = document.createElement("div");
      collection = ReactDOM.render(
        <Collection {...collectionData} isFetching={true}/>,
        node
      );
      document.body.scrollTop = 1000;
    });

    it("scrolls to top when new collection fetched successfully", () => {
      ReactDOM.render(
        <Collection {...collectionData} isFetching={false}/>,
        node
      );

      expect(document.body.scrollTop).toEqual(0);
    });

    it("does not scroll when there's an error", () => {
      ReactDOM.render(
        <Collection {...collectionData} isFetching={false} error={"error"}/>,
        node
      );

      expect(document.body.scrollTop).toEqual(1000);
    });
  });

});

