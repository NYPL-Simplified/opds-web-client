jest.dontMock("../Collection");
jest.dontMock("../Lane");
jest.dontMock("../Book");
jest.dontMock("../LaneBook");
jest.dontMock("../Link");
jest.dontMock("../CollectionLink");
jest.dontMock("../FacetGroup");
jest.dontMock("../SkipNavigationLink");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import Collection from "../Collection";
import Lane from "../Lane";
import Book from "../Book";
import LaneBook from "../LaneBook";
import FacetGroup from "../FacetGroup";
import CollectionLink from "../CollectionLink";
import SkipNavigationLink from "../SkipNavigationLink";
import { groupedCollectionData, ungroupedCollectionData } from "./collectionData";
import { CollectionData } from "../../interfaces";

describe("Collection", () => {
  describe("collection with lanes", () => {
    let collectionData: CollectionData = groupedCollectionData;
    let collection;

    beforeEach(() => {
      collection = TestUtils.renderIntoDocument(
        <Collection collection={collectionData} />
      );
    });

    it("contains #main anchor", () => {
      let link = TestUtils.findRenderedDOMComponentWithClass(collection, "mainAnchor");
      expect(link.getAttribute("name")).toBe("main");
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
      let laneTitles = lanes.map(lane => lane.props.lane.title);
      expect(laneTitles).toEqual(collectionData.lanes.map(lane => lane.title));
    });
  });

  describe("collection without lanes", () => {
    let collectionData = ungroupedCollectionData;
    let collection;

    beforeEach(() => {
      collection = TestUtils.renderIntoDocument(
        <Collection collection={collectionData} />
      );
    });

    it("shows #main anchor", () => {
      let link = TestUtils.findRenderedDOMComponentWithClass(collection, "mainAnchor");
      expect(link.getAttribute("name")).toBe("main");
    });

    it("shows books", () => {
      let collection = TestUtils.renderIntoDocument(
        <Collection collection={collectionData} />
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
        <Collection collection={collectionData} />
      );
      let books: Book[] = TestUtils.scryRenderedComponentsWithType(collection, Book);
      let bookTitles = books.map(book => book.props.book.title);
      expect(bookTitles).toEqual(collectionData.books.map(book => book.title));
    });
  });

  describe("collection with facetGroups", () => {
    let collectionData, collection;

    beforeEach(() => {
      collectionData = {
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

      collection = TestUtils.renderIntoDocument(
        <Collection collection={collectionData} />
      );
    });

    it("shows facet groups", () => {
      let facetGroups: FacetGroup[] = TestUtils.scryRenderedComponentsWithType(collection, FacetGroup);
      expect(facetGroups.length).toEqual(1);
    });

    it("shows skip navigation link for facet groups", () => {
      let link = TestUtils.findRenderedComponentWithType(collection, SkipNavigationLink);
      expect(link).toBeTruthy();
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
        nextPageUrl: "next"
      };

      let collection = TestUtils.renderIntoDocument(
        <Collection collection={collectionData} fetchPage={fetchPage} />
      );

      document.body.scrollTop = 1000;
      document.body.scrollHeight = 1;
      window.dispatchEvent(new (window as any).UIEvent("scroll", {detail: 0}));

      expect(fetchPage.mock.calls.length).toEqual(1);
      expect(fetchPage.mock.calls[0][0]).toEqual("next");

      // firefox puts scrollTop in document.documentElement instead of document.body
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 1000;
      document.body.scrollHeight = 1;
      window.dispatchEvent(new (window as any).UIEvent("scroll", {detail: 0}));

      expect(fetchPage.mock.calls.length).toEqual(2);
      expect(fetchPage.mock.calls[1][0]).toEqual("next");

    });

    it("fetches next page if first page doesn't fill window", () => {
      document.body.scrollTop = 1000;
      document.body.scrollHeight = 1;

      let fetchPage = jest.genMockFunction();
      let collectionData = {
        id: "test collection",
        url: "test url",
        title: "title",
        books: [],
        lanes: [],
        links: [],
        nextPageUrl: "next"
      };

      let collection = TestUtils.renderIntoDocument(
        <Collection collection={collectionData} fetchPage={fetchPage} />
      );

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
      };

      let collection = TestUtils.renderIntoDocument(
        <Collection collection={collectionData} isFetchingPage={true} />
      );

      let loading = TestUtils.findRenderedDOMComponentWithClass(collection, "loadingNextPage");
      expect(loading.textContent).toContain("Loading");
    });

    it("contains next page button", () => {
      let fetchPage = jest.genMockFunction();
      let collectionData = Object.assign({}, ungroupedCollectionData, {
        nextPageUrl: "next page url"
      });
      let collection = TestUtils.renderIntoDocument(
        <Collection collection={collectionData} isFetchingPage={false} fetchPage={fetchPage} />
      );

      let link = TestUtils.findRenderedDOMComponentWithClass(collection, "nextPageLink");
      expect(link.textContent).toBe("Load more books");
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
        <Collection collection={collectionData} isFetching={true}/>,
        node
      );
      document.body.scrollTop = 1000;
    });

    it("scrolls to top when new collection fetched successfully", () => {
      ReactDOM.render(
        <Collection collection={collectionData} isFetching={false}/>,
        node
      );

      expect(document.body.scrollTop).toEqual(0);
    });

    it("does not scroll when there's an error", () => {
      let error = {
        status: 500,
        response: "error",
        url: "url"
      };
      ReactDOM.render(
        <Collection collection={collectionData} isFetching={false} error={error}/>,
        node
      );

      expect(document.body.scrollTop).toEqual(1000);
    });
  });

});

