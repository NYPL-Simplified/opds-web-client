jest.autoMockOff();

import * as React from "react";
import { shallow, mount } from "enzyme";

import Collection from "../Collection";
import { Lanes } from "../Lanes";
import Book from "../Book";
import LaneBook from "../LaneBook";
import FacetGroup from "../FacetGroup";
import SkipNavigationLink from "../SkipNavigationLink";
import LoadingIndicator from "../LoadingIndicator";
import { groupedCollectionData, ungroupedCollectionData } from "./collectionData";
import { CollectionData } from "../../interfaces";
import { mockRouterContext } from "./routing";

describe("Collection", () => {
  describe("empty collection", () => {
    it("says the collection is empty", () => {
      let collectionData: CollectionData = Object.assign({}, groupedCollectionData, { lanes: [] });
      let wrapper = shallow(<Collection collection={collectionData} />);
      expect(wrapper.text()).toBe("No books here.");
    });
  });

  describe("collection with lanes", () => {
    let collectionData: CollectionData = groupedCollectionData;
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <Collection collection={collectionData} />
      );
    });

    it("contains #main anchor", () => {
      let link = wrapper.find(".mainAnchor");
      expect(link.props().name).toBe("main");
    });

    it("shows lanes", () => {
      let lanes = wrapper.find(Lanes);
      expect(lanes.props().url).toBe(collectionData.url);
      expect(lanes.props().lanes).toEqual(collectionData.lanes);
    });
  });

  describe("collection without lanes", () => {
    let collectionData = ungroupedCollectionData;
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <Collection collection={collectionData} />
      );
    });

    it("shows #main anchor", () => {
      let link = wrapper.find(".mainAnchor");
      expect(link.props().name).toBe("main");
    });

    it("shows books in order", () => {
      let books = wrapper.find(Book);
      let bookDatas = books.map(book => book.props().book);
      let uniqueCollectionUrls = Array.from(new Set(books.map(book => book.props().collectionUrl)));

      expect(books.length).toBe(collectionData.books.length);
      expect(bookDatas).toEqual(collectionData.books);
      expect(uniqueCollectionUrls).toEqual([collectionData.url]);
    });
  });

  describe("collection with facetGroups", () => {
    let collectionData, wrapper;

    beforeEach(() => {
      collectionData = {
        id: "test collection",
        url: "test url",
        title: "title",
        books: [],
        lanes: [],
        navigationLinks: [],
        facetGroups: [{
          label: "group",
          facets: []
        }]
      };

      wrapper = shallow(
        <Collection collection={collectionData} />
      );
    });

    it("shows facet groups", () => {
      let facetGroups = wrapper.find(FacetGroup);
      let facetGroupDatas = facetGroups.map(group => group.props().facetGroup);
      expect(facetGroups.length).toEqual(1);
      expect(facetGroupDatas).toEqual(collectionData.facetGroups);
    });

    it("shows skip navigation link for facet groups", () => {
      let links = wrapper.find(SkipNavigationLink);
      expect(links.length).toBe(1);
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
        navigationLinks: [],
        nextPageUrl: "next"
      };
      let context = mockRouterContext();
      let wrapper = mount(
        <Collection collection={collectionData} fetchPage={fetchPage} />,
        { context }
      );

      document.body.scrollTop = 1000;
      document.body.scrollHeight = 1;
      window.dispatchEvent(new UIEvent("scroll", {detail: 0}));

      expect(fetchPage.mock.calls.length).toEqual(1);
      expect(fetchPage.mock.calls[0][0]).toEqual("next");

      // firefox puts scrollTop in document.documentElement instead of document.body
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 1000;
      document.body.scrollHeight = 1;
      window.dispatchEvent(new UIEvent("scroll", {detail: 0}));

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
        navigationLinks: [],
        nextPageUrl: "next"
      };
      let context = mockRouterContext();
      let wrapper = mount(
        <Collection collection={collectionData} fetchPage={fetchPage} />,
        { context }
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
        navigationLinks: [],
      };

      let wrapper = shallow(
        <Collection collection={collectionData} isFetchingPage={true} />
      );

      let loadings = wrapper.find(".loadingNextPage");
      expect(loadings.length).toBe(1);
    });

    it("contains next page button", () => {
      let fetchPage = jest.genMockFunction();
      let collectionData = Object.assign({}, ungroupedCollectionData, {
        nextPageUrl: "next page url"
      });
      let wrapper = shallow(
        <Collection collection={collectionData} isFetchingPage={false} fetchPage={fetchPage} />
      );

      let link = wrapper.find(".nextPageLink");
      expect(link.text()).toBe("Load more books");
    });
  });

  describe("collection that scrolls", () => {
    let collectionData = {
      id: "test collection",
      url: "test url",
      title: "title",
      books: [],
      lanes: [],
      navigationLinks: []
    };
    let wrapper;
    let context;

    beforeEach(() => {
      context = mockRouterContext();
      wrapper = mount(
        <Collection collection={collectionData} isFetching={true}/>,
        { context }
      );
      document.body.scrollTop = 1000;
    });

    it("scrolls to top when new collection fetched successfully", () => {
      wrapper.setProps({ isFetching: false });

      expect(document.body.scrollTop).toEqual(0);
    });

    it("does not scroll when there's an error", () => {
      let error = {
        status: 500,
        response: "error",
        url: "url"
      };
      wrapper = mount(
        <Collection collection={collectionData} isFetching={false} error={error}/>,
        { context }
      );

      expect(document.body.scrollTop).toEqual(1000);
    });
  });

});

