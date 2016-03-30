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
import Search from "../Search";
import { groupedCollectionData, ungroupedCollectionData } from "./collectionData";
import buildStore from "../../store";

describe("Root", () => {
  it("shows skip navigation link", () => {
    let root = TestUtils.renderIntoDocument(
      <Root />
    );

    let link = TestUtils.findRenderedComponentWithType(root, SkipNavigationLink);
    expect(link).toBeTruthy();
  });

  it("shows search and treats it as top-level", () => {
    let collectionData = Object.assign({}, ungroupedCollectionData, {
      search: {
        url: "test search url",
        searchData: {
          description: "description",
          shortName: "shortName",
          template: (s) => s
        }
      }
    });
    let navigate = jest.genMockFunction();

    let root = TestUtils.renderIntoDocument(
      <Root
        collectionData={collectionData}
        fetchSearchDescription={(url: string) => {}}
        navigate={navigate}
        />
    );
    let search = TestUtils.findRenderedComponentWithType(root, Search);
    let form = TestUtils.findRenderedDOMComponentWithTag(search, "form");
    TestUtils.Simulate.submit(form);
    expect(search).toBeTruthy();
    expect(search.props.isTopLevel).toBe(true);
    expect(form).toBeTruthy();
    expect(navigate.mock.calls.length).toBe(1);
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

  it("shows a url form if no collection url or book url", () => {
    let root = TestUtils.renderIntoDocument(
      <Root />
    );

    let urlForms = TestUtils.scryRenderedComponentsWithType(root, UrlForm);
    expect(urlForms.length).toBe(1);
  });

  it("doesn't show a url form if collection url", () => {
    let root = TestUtils.renderIntoDocument(
      <Root collectionUrl="test" setCollectionAndBook={jest.genMockFunction()} />
    );

    let urlForms = TestUtils.scryRenderedComponentsWithType(root, UrlForm);
    expect(urlForms.length).toBe(0);
  });

  it("doesn't show a url form if book url", () => {
    let root = TestUtils.renderIntoDocument(
      <Root bookUrl="test" setCollectionAndBook={jest.genMockFunction()} />
    );

    let urlForms = TestUtils.scryRenderedComponentsWithType(root, UrlForm);
    expect(urlForms.length).toBe(0);
  });

  it("fetches a collection url on mount", () => {
    let collectionUrl = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let setCollectionAndBook = jest.genMockFunction();
    let root = TestUtils.renderIntoDocument(
      <Root collectionUrl={collectionUrl} setCollectionAndBook={setCollectionAndBook}/>
    );

    expect(setCollectionAndBook.mock.calls.length).toBe(1);
    expect(setCollectionAndBook.mock.calls[0][0]).toBe(collectionUrl);
    expect(setCollectionAndBook.mock.calls[0][1]).toBeFalsy();
  });

  it("fetches a book url on mount", () => {
    let bookUrl = "http://example.com/book";
    let setCollectionAndBook = jest.genMockFunction();
    let root = TestUtils.renderIntoDocument(
      <Root bookUrl={bookUrl} setCollectionAndBook={setCollectionAndBook}/>
    );

    expect(setCollectionAndBook.mock.calls.length).toBe(1);
    expect(setCollectionAndBook.mock.calls[0][0]).toBeFalsy();
    expect(setCollectionAndBook.mock.calls[0][1]).toBe(bookUrl);
  });

  it("fetches a collection url when updated", () => {
    let elem = document.createElement("div");
    let collectionUrl = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let newCollection = "new collection url";
    let setCollectionAndBook = jest.genMockFunction();
    let root = ReactDOM.render(
      <Root collectionUrl={collectionUrl} setCollectionAndBook={setCollectionAndBook} />,
      elem
    );
    ReactDOM.render(
      <Root collectionUrl={newCollection} setCollectionAndBook={setCollectionAndBook} isTopLevel={true} />,
      elem
    );

    expect(setCollectionAndBook.mock.calls.length).toBe(2);
    expect(setCollectionAndBook.mock.calls[1][0]).toBe(newCollection);
    expect(setCollectionAndBook.mock.calls[1][1]).toBeFalsy();
    expect(setCollectionAndBook.mock.calls[1][2]).toBe(true);
  });

  it("shows loading message", () => {
    let root = TestUtils.renderIntoDocument(
      <Root isFetching={true}/>
    );

    let loading = TestUtils.findRenderedDOMComponentWithClass(root, "loading");
    expect(loading.textContent).toBeTruthy();
  });

  it("shows error message", () => {
    let fetchError = {
      status: 500,
      response: "test error",
      url: "test error url"
    };
    let root = TestUtils.renderIntoDocument(
      <Root error={fetchError}/>
    );

    let error = TestUtils.findRenderedDOMComponentWithClass(root, "error");
    expect(error.textContent).toContain("test error url");
  });

  it("shows book detail", () => {
    let bookData = groupedCollectionData.lanes[0].books[0];
    let root = TestUtils.renderIntoDocument(
      <Root bookData={bookData}/>
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
    class Container extends React.Component<BookDetailsContainerProps, any> {
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

  it("creates a ref for book detail container", () => {
    class Container extends React.Component<BookDetailsContainerProps, any> {
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
    ) as Root;
    let container = TestUtils.findRenderedComponentWithType(root, Container);
    expect(root.bookDetailsContainer.props).toEqual(container.props);
  });

  it("sets page title after updating", () => {
    let elem = document.createElement("div");
    let collectionData = ungroupedCollectionData;
    let bookData = collectionData.books[0];
    let pageTitleTemplate = jest.genMockFunction();
    pageTitleTemplate.mockImplementation((collectionTitle, bookTitle) => {
      return "testing " + collectionTitle + ", " + bookTitle;
    });
    let root = ReactDOM.render(
      <Root
        collectionData={collectionData}
        bookData={bookData}
        pageTitleTemplate={pageTitleTemplate} />,
      elem
    );

    // template should be invoked by componentWillMount
    expect(pageTitleTemplate.mock.calls.length).toBe(1);
    expect(pageTitleTemplate.mock.calls[0][0]).toBe(collectionData.title);
    expect(pageTitleTemplate.mock.calls[0][1]).toBe(bookData.title);
    expect(document.title).toBe("testing " + collectionData.title + ", " + bookData.title);

    ReactDOM.render(
      <Root collectionData={null} bookData={null} pageTitleTemplate={pageTitleTemplate} />,
      elem
    );

    // template should be invoked again by componentWillUpdate
    expect(pageTitleTemplate.mock.calls.length).toBe(2);
    expect(pageTitleTemplate.mock.calls[1][0]).toBe(null);
    expect(pageTitleTemplate.mock.calls[1][1]).toBe(null);
    expect(document.title).toBe("testing null, null");
  });

  describe("when given a header component", () => {
    let root;
    let collectionData = Object.assign({}, ungroupedCollectionData, {
      search: {
        url: "test search url",
        searchData: {
          description: "description",
          shortName: "shortName",
          template: (s) => s
        }
      }
    });
    let navigate = jest.genMockFunction();

    class Header extends React.Component<HeaderProps, any> {
      render(): JSX.Element {
        return (
          <div className="header">
            { this.props.children }
            { this.props.renderCollectionLink("test", "test url") }
          </div>
        );
      }
    }

    beforeEach(() => {
      root = TestUtils.renderIntoDocument(
        <Root
          header={Header}
          collectionData={collectionData}
          fetchSearchDescription={(url: string) => {}}
          navigate={navigate}
          />
      ) as Root;
    });

    it("shows the given header", () => {
      let header = TestUtils.findRenderedComponentWithType(root, Header);
      let search = TestUtils.findRenderedComponentWithType(header, Search);
      let link = TestUtils.findRenderedComponentWithType(header, CollectionLink);
      expect(root.header.props).toEqual(header.props);
      expect(search.props.url).toBe("test search url");
      expect(link.props.text).toBe("test");
      expect(link.props.url).toBe("test url");
    });

    it("treats links in the header as top-level", () => {
      let header = TestUtils.findRenderedComponentWithType(root, Header);
      let search = TestUtils.findRenderedComponentWithType(header, Search);
      let link = TestUtils.findRenderedDOMComponentWithTag(header, "a");
      TestUtils.Simulate.click(link);
      expect(navigate.mock.calls.length).toBe(1);
      expect(navigate.mock.calls[0][2]).toBe(true);
    });

    it("treats search in the header as top-level", () => {
      let header = TestUtils.findRenderedComponentWithType(root, Header);
      let button = TestUtils.findRenderedDOMComponentWithTag(header, "button");
      TestUtils.Simulate.click(button);
      expect(navigate.mock.calls.length).toBe(1);
      expect(navigate.mock.calls[0][2]).toBe(true);
    });
  });

  describe("connected to store", () => {
    let store: Redux.Store;
    let collectionData: CollectionData = groupedCollectionData;
    let bookData: BookData = groupedCollectionData.lanes[0].books[0];
    let navigate;
    let root, rootInstance;

    beforeEach(() => {
      store = buildStore();
      navigate = jest.genMockFunction();
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
          navigate={navigate}
          pathFor={pathFor}
          collectionData={collectionData} />
      );
      rootInstance = root.getWrappedInstance();
    });

    it("calls navigate when showing a collection", () => {
      let collectionLink = TestUtils.scryRenderedDOMComponentsWithClass(rootInstance, "laneTitle")[0];
      let collectionUrl = decodeURIComponent(collectionLink.getAttribute("href").split("collection=")[1]);
      TestUtils.Simulate.click(collectionLink);

      expect(navigate.mock.calls.length).toBe(1);
      expect(navigate.mock.calls[0][0]).toBe(collectionUrl);
    });

    it("calls navigate when showing or hiding a book", () => {
      let bookLink =  TestUtils.scryRenderedDOMComponentsWithClass(rootInstance, "laneBookLink")[0];
      let url = bookLink.getAttribute("href");
      let parts = url.slice(1).split("&");
      let collectionUrl = decodeURIComponent(parts[0].split("=")[1]);
      let bookUrl = decodeURIComponent(parts[1].split("=")[1]);
      TestUtils.Simulate.click(bookLink);

      expect(navigate.mock.calls.length).toBe(1);
      expect(navigate.mock.calls[0][0]).toBe(collectionUrl);
      expect(navigate.mock.calls[0][1]).toBe(bookUrl);

      TestUtils.renderIntoDocument(
        <ConnectedRoot
          store={store}
          ref={(c) => root = c}
          navigate={navigate}
          collectionData={collectionData}
          bookData={bookData} />
      );
      rootInstance = root.getWrappedInstance();
      let collectionLink = TestUtils.findRenderedDOMComponentWithClass(rootInstance, "currentCollectionLink");
      TestUtils.Simulate.click(collectionLink);

      expect(navigate.mock.calls.length).toBe(2);
      expect(navigate.mock.calls[1][0]).toBe(collectionUrl);
      expect(navigate.mock.calls[1][1]).toBe(null);
    });
  });
});