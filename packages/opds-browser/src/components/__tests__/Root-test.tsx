jest.autoMockOff();

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import ConnectedRoot, { Root } from "../Root";
import Breadcrumbs from "../Breadcrumbs";
import Collection from "../Collection";
import UrlForm from "../UrlForm";
import BookDetails from "../BookDetails";
import SkipNavigationLink from "../SkipNavigationLink";
import CollectionLink from "../CollectionLink";
import { groupedCollectionData, ungroupedCollectionData } from "./collectionData";
import { createStore, applyMiddleware } from "redux";
let thunk: any = require("redux-thunk");
import reducers from "../../reducers/index";
import { Provider } from "react-redux";

describe("Root", () => {
  it("shows skip navigation link", () => {
    let root = TestUtils.renderIntoDocument(
      <Root />
    );

    let link = TestUtils.findRenderedComponentWithType(root, SkipNavigationLink);
    expect(link).toBeTruthy;
  });

  it("shows a collection if props include collectionData", () => {
    let collectionData: CollectionData = groupedCollectionData;
    let root = TestUtils.renderIntoDocument(
      <Root collectionData={collectionData} />
    );

    let collections = TestUtils.scryRenderedComponentsWithType(root, Collection);
    expect(collections.length).toBe(1);
    expect(collections[0].props.collection.title).toBe(collectionData.title);
  });

  it("shows a header title if a collection is loaded", () => {
    let collectionData: CollectionData = groupedCollectionData;
    let root = TestUtils.renderIntoDocument(
      <Root collectionData={collectionData} />
    );

    let titleElement = TestUtils.findRenderedDOMComponentWithClass(root, "headerTitle");
    expect(titleElement.textContent).toEqual(collectionData.title);
  });

  it("shows a url form if props do not include collectionData", () => {
    let root = TestUtils.renderIntoDocument(
      <Root />
    );

    let urlForms = TestUtils.scryRenderedComponentsWithType(root, UrlForm);
    expect(urlForms.length).toBe(1);
  });

  it("fetches a collection url on mount", () => {
    let startCollection = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let setCollectionAndBook = jest.genMockFunction();
    let root = TestUtils.renderIntoDocument(
      <Root collection={startCollection} setCollectionAndBook={setCollectionAndBook} />
    );

    expect(setCollectionAndBook.mock.calls.length).toBe(1);
    expect(setCollectionAndBook.mock.calls[0][0]).toBe(startCollection);
  });

  it("fetches a book url on mount", () => {
    let startBook = "http://example.com/book";
    let setCollectionAndBook = jest.genMockFunction();
    let root = TestUtils.renderIntoDocument(
      <Root book={startBook} setCollectionAndBook={setCollectionAndBook} />
    );

    expect(setCollectionAndBook.mock.calls.length).toBe(1);
    expect(setCollectionAndBook.mock.calls[0][1]).toBe(startBook);
  });

  it("fetches a collection url when updated", () => {
    let elem = document.createElement("div");
    let startCollection = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let newCollection = "new collection url";
    let setCollectionAndBook = jest.genMockFunction();
    let root = ReactDOM.render(
      <Root collection={startCollection} setCollectionAndBook={setCollectionAndBook} />,
      elem
    );
    ReactDOM.render(
      <Root collection={newCollection} setCollectionAndBook={setCollectionAndBook} />,
      elem
    );

    expect(setCollectionAndBook.mock.calls.length).toBe(2);
    expect(setCollectionAndBook.mock.calls[1][0]).toBe(newCollection);
  });

  it("shows loading message", () => {
    let root = TestUtils.renderIntoDocument(
      <Root isFetching={true} />
    );

    let loading = TestUtils.findRenderedDOMComponentWithClass(root, "loading");
    expect(loading.textContent).toBeTruthy;
  });

  it("shows error message", () => {
    let root = TestUtils.renderIntoDocument(
      <Root error={"test error"} />
    );

    let error = TestUtils.findRenderedDOMComponentWithClass(root, "error");
    expect(error.textContent).toContain("test error");
  });

  it("shows book detail", () => {
    let bookData = groupedCollectionData.lanes[0].books[0];
    let root = TestUtils.renderIntoDocument(
      <Root bookData={bookData} />
    );
    let book = TestUtils.findRenderedDOMComponentWithClass(root, "bookDetails");

    expect(book.textContent).toContain(bookData.title);
    expect(book.textContent).toContain(bookData.authors.join(", "));
  });

  it("shows breadcrumbs", () => {
    let history = [{
      id: "2nd id",
      text: "2nd title",
      url: "2nd url"
    }, {
      id: "last id",
      text: "last title",
      url: "last url"
    }];

    let root = TestUtils.renderIntoDocument(
      <Root collectionData={ungroupedCollectionData} history={history} />
    );

    let breadcrumbs = TestUtils.findRenderedComponentWithType(root, Breadcrumbs);
    expect(breadcrumbs.props.history).toEqual(history);
  });

  it("shows book detail container from config", () => {
    class Container extends React.Component<BookProps, any> {
      render(): JSX.Element {
        return (
          <div className="container">
            {this.props.children}
          </div>
        );
      }
    }

    let bookData = groupedCollectionData.lanes[0].books[0];
    let root = TestUtils.renderIntoDocument(
      <Root bookData={bookData} BookDetailsContainer={Container} />
    );
    let container = TestUtils.findRenderedDOMComponentWithClass(root, "container");
    expect(container.textContent).toContain(bookData.title);
  });

  describe("connected to store", () => {
    let store: Redux.Store;
    let collectionData: CollectionData = groupedCollectionData;
    let onNavigate;
    let root, rootInstance;

    beforeEach(() => {
      store = createStore(reducers, applyMiddleware(thunk));
      onNavigate = jest.genMockFunction();
      let pathFor = (collectionUrl, bookUrl) => {
        let path = "?collection=" + encodeURIComponent(collectionUrl);
        if (bookUrl) {
          path += "&book=" + encodeURIComponent(bookUrl);
        }
        return path;
      };
      TestUtils.renderIntoDocument(
        <ConnectedRoot
          store={store}
          ref={(c) => root = c}
          onNavigate={onNavigate}
          pathFor={pathFor}
          collectionData={collectionData} />
      );
      rootInstance = root.getWrappedInstance();
    });

    it("calls onNavigate when fetching collection", () => {
      let collectionLink = TestUtils.scryRenderedDOMComponentsWithClass(rootInstance, "laneTitle")[0];
      let collectionUrl = decodeURIComponent(collectionLink.getAttribute("href").split("collection=")[1]);
      TestUtils.Simulate.click(collectionLink);

      expect(onNavigate.mock.calls.length).toBe(1);
      expect(onNavigate.mock.calls[0][0]).toBe(collectionUrl);
    });

    it("calls onNavigate when showing or hiding a book", () => {
      let bookLink =  TestUtils.scryRenderedDOMComponentsWithClass(rootInstance, "laneBookLink")[0];
      let url = bookLink.getAttribute("href");
      let parts = url.slice(1).split("&");
      let collectionUrl = decodeURIComponent(parts[0].split("=")[1]);
      let bookUrl = decodeURIComponent(parts[1].split("=")[1]);
      TestUtils.Simulate.click(bookLink);
      let links = TestUtils.scryRenderedDOMComponentsWithClass(rootInstance, "currentCollectionLink");
      TestUtils.Simulate.click(links[0]);

      expect(onNavigate.mock.calls.length).toBe(2);
      // can't test collectionUrl because it comes from Root's props,
      // which only get set asynchronously from a fetch, which is too
      // much for this test:
      // expect(onNavigate.mock.calls[0][0]).toBe(collectionUrl);
      expect(onNavigate.mock.calls[0][1]).toBe(bookUrl);
      expect(onNavigate.mock.calls[1][1]).toBeFalsy;
    });
  });
});