import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import { shallow, mount } from "enzyme";

import Collection from "../Collection";
import { Lanes } from "../Lanes";
import Book from "../Book";
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
      expect(wrapper.text()).to.equal("No books found.");
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

    it("contains main div", () => {
      let link = wrapper.find("#collection-main");
      expect(link.length).to.equal(1);
    });

    it("shows lanes", () => {
      let lanes = wrapper.find(Lanes);
      expect(lanes.props().url).to.equal(collectionData.url);
      expect(lanes.props().lanes).to.equal(collectionData.lanes);
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

    it("contains main div", () => {
      let link = wrapper.find("#collection-main");
      expect(link.length).to.equal(1);
    });

    it("shows books in order", () => {
      let books = wrapper.find(Book);
      let bookDatas = books.map(book => book.props().book);
      let uniqueCollectionUrls = Array.from(new Set(books.map(book => book.props().collectionUrl)));

      expect(books.length).to.equal(collectionData.books.length);
      expect(bookDatas).to.deep.equal(collectionData.books);
      expect(uniqueCollectionUrls).to.deep.equal([collectionData.url]);
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
      expect(facetGroups.length).to.equal(1);
      expect(facetGroupDatas).to.deep.equal(collectionData.facetGroups);
    });

    it("shows skip navigation link for facet groups", () => {
      let links = wrapper.find(SkipNavigationLink);
      expect(links.length).to.equal(1);
    });

  });

  describe("collection with next page", () => {
    const pause = (ms = 0): Promise<void> => {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    };

    it("fetches next page on scroll to bottom", async () => {
      let fetchPage = stub();
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

      let main = wrapper.instance().refs["collection-main"] as any;
      main.scrollTop = 1000;
      main.scrollHeight = 1;
      main.clientHeight = 1;
      (wrapper.instance() as Collection).handleScrollOrResize();
      await pause(51);

      expect(fetchPage.callCount).to.equal(1);
      expect(fetchPage.args[0][0]).to.equal("next");
    });

    it("fetches next page if first page doesn't fill window", async () => {
      let fetchPage = stub();
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

      let main = wrapper.instance().refs["collection-main"] as any;
      main.scrollTop = 1000;
      main.scrollHeight = 1;
      main.clientHeight = 1;

      (wrapper as any).mount();
      await pause(51);

      expect(fetchPage.callCount).to.equal(1);
      expect(fetchPage.args[0][0]).to.equal("next");
    });

    it("fetches next page if newly loaded page doesn't fill window", async () => {
      let fetchPage = stub();
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

      let main = wrapper.instance().refs["collection-main"] as any;
      main.scrollTop = 1;
      main.scrollHeight = 100;
      main.clientHeight = 1000;

      (wrapper as any).mount();
      await pause(51);

      expect(fetchPage.callCount).to.equal(1);
      expect(fetchPage.args[0][0]).to.equal("next");

      wrapper.setProps({ isFetching: false });
      await pause(51);

      // body's scroll attributes haven't changed

      expect(fetchPage.callCount).to.equal(2);
      expect(fetchPage.args[1][0]).to.equal("next");
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

      let loadings = wrapper.find(".loading-next-page");
      expect(loadings.length).to.equal(1);
    });

    it("contains next page button", () => {
      let fetchPage = stub();
      let collectionData = Object.assign({}, ungroupedCollectionData, {
        nextPageUrl: "next page url"
      });
      let wrapper = shallow(
        <Collection collection={collectionData} isFetchingPage={false} fetchPage={fetchPage} />
      );

      let link = wrapper.find(".next-page-link");
      expect(link.text()).to.equal("Load more books");
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
    let main;

    beforeEach(() => {
      context = mockRouterContext();
      wrapper = mount(
        <Collection collection={collectionData} isFetching={true}/>,
        { context }
      );
      main = wrapper.instance().refs["collection-main"] as any;
      main.scrollTop = 1000;
      main.scrollHeight = 1;
      main.clientHeight = 1;
    });

    it("scrolls to top when new collection fetched successfully", () => {
      wrapper.setProps({ isFetching: false });

      expect(main.scrollTop).to.equal(0);
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

      expect(main.scrollTop).to.equal(1000);
    });
  });

});

