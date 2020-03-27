import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import * as PropTypes from "prop-types";
import { shallow, mount } from "enzyme";

import Collection from "../Collection";
import { Lanes } from "../Lanes";
import Book from "../Book";
import FacetGroup from "../FacetGroup";
import SkipNavigationLink from "../SkipNavigationLink";
import {
  groupedCollectionData,
  ungroupedCollectionData
} from "./collectionData";
import { CollectionData } from "../../interfaces";
import { mockRouterContext } from "../../__mocks__/routing";

describe("Collection", () => {
  let updateBook;
  let fulfillBook;
  let indirectFulfillBook;
  let setPreference;

  beforeEach(() => {
    updateBook = stub();
    fulfillBook = stub();
    indirectFulfillBook = stub();
    setPreference = stub();
  });

  describe("empty collection", () => {
    it("says the collection is empty", () => {
      let collectionData: CollectionData = {
        ...groupedCollectionData,
        lanes: []
      };
      let wrapper = mount(
        <Collection
          collection={collectionData}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />
      );
      expect(wrapper.text()).to.equal("No books found.");
    });
  });

  describe("collection with lanes", () => {
    let collectionData: CollectionData = groupedCollectionData;
    let wrapper;

    beforeEach(() => {
      let context = mockRouterContext();
      wrapper = mount(
        <Collection
          collection={collectionData}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />,
        {
          context,
          childContextTypes: {
            router: PropTypes.object,
            pathFor: PropTypes.func
          }
        }
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

    it("doesn't show view toggle buttons", () => {
      let viewToggleButtons = wrapper.find(".view-toggle button");
      expect(viewToggleButtons.length).to.equal(0);
    });
  });

  describe("collection without lanes", () => {
    let collectionData = ungroupedCollectionData;
    let wrapper;

    beforeEach(() => {
      let context = mockRouterContext();
      wrapper = mount(
        <Collection
          collection={collectionData}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />,
        {
          context,
          childContextTypes: {
            router: PropTypes.object,
            pathFor: PropTypes.func
          }
        }
      );
    });

    it("contains main div", () => {
      let link = wrapper.find("#collection-main");
      expect(link.length).to.equal(1);
    });

    it("shows books in order", () => {
      let books = wrapper.find(Book);
      let bookDatas = books.map(book => book.props().book);
      let uniqueCollectionUrls = Array.from(
        new Set(books.map(book => book.props().collectionUrl))
      );

      expect(books.length).to.equal(collectionData.books.length);
      expect(bookDatas).to.deep.equal(collectionData.books);
      expect(uniqueCollectionUrls).to.deep.equal([collectionData.url]);
    });

    it("shows grid or list view", () => {
      let context = mockRouterContext();
      wrapper = mount(
        <Collection
          collection={collectionData}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />,
        {
          context,
          childContextTypes: {
            router: PropTypes.object,
            pathFor: PropTypes.func
          }
        }
      );
      const getElements = () => {
        let viewToggleButtons = wrapper.find(".view-toggle button");

        return {
          viewToggleButtons,
          gridButton: viewToggleButtons.at(0),
          listButton: viewToggleButtons.at(1),
          books: wrapper.find(".books")
        };
      };
      let { viewToggleButtons, gridButton, listButton, books } = getElements();

      expect(viewToggleButtons.length).to.equal(2);
      expect(gridButton.props().disabled).to.equal(true);
      expect(listButton.props().disabled).to.equal(false);
      expect(books.props().className).to.contain(Collection.GRID_VIEW);
      expect(books.props().className).not.to.contain(Collection.LIST_VIEW);

      let preferences = {};
      preferences[Collection.VIEW_KEY] = Collection.LIST_VIEW;
      wrapper.setProps({ preferences });

      ({ viewToggleButtons, gridButton, listButton, books } = getElements());
      expect(gridButton.props().disabled).to.equal(false);
      expect(listButton.props().disabled).to.equal(true);
      expect(books.props().className).to.contain(Collection.LIST_VIEW);
      expect(books.props().className).not.to.contain(Collection.GRID_VIEW);

      preferences[Collection.VIEW_KEY] = Collection.GRID_VIEW;
      wrapper.setProps({ preferences });

      ({ viewToggleButtons, gridButton, listButton, books } = getElements());
      expect(gridButton.props().disabled).to.equal(true);
      expect(listButton.props().disabled).to.equal(false);
      expect(books.props().className).to.contain(Collection.GRID_VIEW);
      expect(books.props().className).not.to.contain(Collection.LIST_VIEW);
    });

    it("sets view preference", () => {
      let context = mockRouterContext();
      wrapper = mount(
        <Collection
          collection={collectionData}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />,
        {
          context,
          childContextTypes: {
            router: PropTypes.object,
            pathFor: PropTypes.func
          }
        }
      );
      let viewToggleButtons = wrapper.find(".view-toggle button");
      expect(viewToggleButtons.length).to.equal(2);

      let gridButton = viewToggleButtons.at(0);
      let listButton = viewToggleButtons.at(1);

      listButton.simulate("click");
      expect(setPreference.callCount).to.equal(1);
      expect(setPreference.args[0][0]).to.equal(Collection.VIEW_KEY);
      expect(setPreference.args[0][1]).to.equal(Collection.LIST_VIEW);

      let preferences = {};
      preferences[Collection.VIEW_KEY] = Collection.LIST_VIEW;
      wrapper.setProps({ preferences });

      gridButton.simulate("click");
      expect(setPreference.callCount).to.equal(2);
      expect(setPreference.args[1][0]).to.equal(Collection.VIEW_KEY);
      expect(setPreference.args[1][1]).to.equal(Collection.GRID_VIEW);
    });
  });

  describe("collection with facetGroups", () => {
    let collectionData, wrapper;

    beforeEach(() => {
      let context = mockRouterContext();
      collectionData = {
        id: "test collection",
        url: "test url",
        title: "title",
        books: [],
        lanes: [],
        navigationLinks: [],
        facetGroups: [
          {
            label: "group",
            facets: []
          }
        ]
      };

      wrapper = mount(
        <Collection
          collection={collectionData}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />,
        {
          context,
          childContextTypes: {
            router: PropTypes.object,
            pathFor: PropTypes.func
          }
        }
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

  describe("collection with navigation links", () => {
    let collectionData, wrapper;

    beforeEach(() => {
      let context = mockRouterContext();
      collectionData = {
        id: "test collection",
        url: "test url",
        title: "title",
        books: [],
        lanes: [],
        navigationLinks: [
          { text: "link 1", url: "url 1" },
          { text: "link 2", url: "url 2" }
        ],
        facetGroups: [
          {
            label: "group",
            facets: []
          }
        ]
      };

      wrapper = mount(
        <Collection
          collection={collectionData}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />,
        {
          context,
          childContextTypes: {
            router: PropTypes.object,
            pathFor: PropTypes.func
          }
        }
      );
    });

    it("renders a navigation links nav", () => {
      let nav = wrapper.find("nav");
      let links = wrapper.find("li");

      expect(nav.prop("role")).to.equal("navigation");
      expect(nav.prop("aria-label")).to.equal("navigation links");
      expect(links.length).to.equal(2);
    });
  });

  describe("collection with next page", () => {
    /**
     * Need to mock the scrollHeight and clientHeight because it
     * is not settable in jsdom
     */
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      get: function() {
        return this._scrollHeight || 0;
      },
      set(val) {
        this._scrollHeight = val;
      }
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      get: function() {
        return this._clientHeight || 0;
      },
      set(val) {
        this._clientHeight = val;
      }
    });

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
        <Collection
          collection={collectionData}
          fetchPage={fetchPage}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />,
        {
          context,
          childContextTypes: {
            router: PropTypes.object,
            pathFor: PropTypes.func
          }
        }
      );

      let main = wrapper.instance().refs["collection-main"] as any;
      main.scrollTop = 1000;
      main.scrollHeight = 1;
      main.clientHeight = 1;
      (wrapper.instance() as any).handleScrollOrResize();
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
        <Collection
          collection={collectionData}
          fetchPage={fetchPage}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />,
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
        <Collection
          collection={collectionData}
          fetchPage={fetchPage}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />,
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

      wrapper.setProps({ isFetchingCollection: false });
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
        navigationLinks: []
      };

      let wrapper = mount(
        <Collection
          collection={collectionData}
          isFetchingPage={true}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />
      );

      let loadings = wrapper.find(".loading-next-page");
      expect(loadings.length).to.equal(1);
    });

    it("contains next page button", () => {
      let fetchPage = stub();
      let collectionData = Object.assign({}, ungroupedCollectionData, {
        nextPageUrl: "next page url"
      });
      let context = mockRouterContext();
      let wrapper = mount(
        <Collection
          collection={collectionData}
          isFetchingPage={false}
          fetchPage={fetchPage}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />,
        {
          context,
          childContextTypes: {
            router: PropTypes.object,
            pathFor: PropTypes.func
          }
        }
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
        <Collection
          collection={collectionData}
          isFetchingCollection={true}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />,
        { context }
      );
      main = wrapper.instance().refs["collection-main"] as any;
      main.scrollTop = 1000;
      main.scrollHeight = 1;
      main.clientHeight = 1;
    });

    it("scrolls to top when new collection fetched successfully", () => {
      wrapper.setProps({ isFetchingCollection: false });

      expect(main.scrollTop).to.equal(0);
    });

    it("does not scroll when there's an error", () => {
      let error = {
        status: 500,
        response: "error",
        url: "url"
      };
      wrapper = mount(
        <Collection
          collection={collectionData}
          isFetchingCollection={false}
          error={error}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          setPreference={setPreference}
        />,
        { context }
      );

      expect(main.scrollTop).to.equal(1000);
    });
  });
});
