jest.autoMockOff();

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import ConnectedRoot, { Root, BookDetailsContainerProps, HeaderProps, RootProps } from "../Root";
import Breadcrumbs from "../Breadcrumbs";
import Collection from "../Collection";
import UrlForm from "../UrlForm";
import BookDetails from "../BookDetails";
import SkipNavigationLink from "../SkipNavigationLink";
import CollectionLink from "../CollectionLink";
import HeaderCollectionLink from "../HeaderCollectionLink";
import BrowserLink, { BrowserLinkProps } from "../BrowserLink";
import Search from "../Search";
import { groupedCollectionData, ungroupedCollectionData } from "./collectionData";
import buildStore from "../../store";
import { CollectionData, BookData } from "../../interfaces";
import withRouterContext from "./routing";

const RootWithContext = withRouterContext<RootProps>(Root);

describe("Root", () => {
  it("shows skip navigation link", () => {
    let root = TestUtils.renderIntoDocument(
      <RootWithContext />
    ) as Root;

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
      <RootWithContext
        collectionData={collectionData}
        fetchSearchDescription={(url: string) => {}}
        navigate={navigate}
        pathFor={jest.genMockFunction()}
        />
    ) as Root;
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
      <RootWithContext
        collectionData={collectionData}
        navigate={jest.genMockFunction()}
        pathFor={jest.genMockFunction()}
        push={jest.genMockFunction()}
        />
    ) as Root;

    let collections = TestUtils.scryRenderedComponentsWithType(root, Collection);
    expect(collections.length).toBe(1);
    expect(collections[0].props.collection.title).toBe(collectionData.title);
  });

  it("shows a url form if no collection url or book url", () => {
    let root = TestUtils.renderIntoDocument(
        <RootWithContext push={jest.genMockFunction()} pathFor={jest.genMockFunction()} />
    );

    let urlForms = TestUtils.scryRenderedComponentsWithType(root as Root, UrlForm);
    expect(urlForms.length).toBe(1);
  });

  it("doesn't show a url form if collection url", () => {
    let root = TestUtils.renderIntoDocument(
      <RootWithContext collectionUrl="test" setCollectionAndBook={jest.genMockFunction()} />
    ) as Root;

    let urlForms = TestUtils.scryRenderedComponentsWithType(root, UrlForm);
    expect(urlForms.length).toBe(0);
  });

  it("doesn't show a url form if book url", () => {
    let root = TestUtils.renderIntoDocument(
      <RootWithContext bookUrl="test" setCollectionAndBook={jest.genMockFunction()} />
    ) as Root;

    let urlForms = TestUtils.scryRenderedComponentsWithType(root, UrlForm);
    expect(urlForms.length).toBe(0);
  });

  it("fetches a collection url on mount", () => {
    let collectionUrl = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let setCollectionAndBook = jest.genMockFunction();
    let root = TestUtils.renderIntoDocument(
      <RootWithContext collectionUrl={collectionUrl} setCollectionAndBook={setCollectionAndBook}/>
    ) as Root;

    expect(setCollectionAndBook.mock.calls.length).toBe(1);
    expect(setCollectionAndBook.mock.calls[0][0]).toBe(collectionUrl);
    expect(setCollectionAndBook.mock.calls[0][1]).toBeFalsy();
  });

  it("fetches a book url on mount", () => {
    let bookUrl = "http://example.com/book";
    let setCollectionAndBook = jest.genMockFunction();
    let root = TestUtils.renderIntoDocument(
      <RootWithContext bookUrl={bookUrl} setCollectionAndBook={setCollectionAndBook}/>
    ) as Root;

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
      <RootWithContext collectionUrl={collectionUrl} setCollectionAndBook={setCollectionAndBook} />,
      elem
    ) as Root;
    ReactDOM.render(
      <RootWithContext collectionUrl={newCollection} setCollectionAndBook={setCollectionAndBook} isTopLevel={true} />,
      elem
    ) as Root;

    expect(setCollectionAndBook.mock.calls.length).toBe(2);
    expect(setCollectionAndBook.mock.calls[1][0]).toBe(newCollection);
    expect(setCollectionAndBook.mock.calls[1][1]).toBeFalsy();
    expect(setCollectionAndBook.mock.calls[1][2]).toBe(true);
  });

  it("shows loading message", () => {
    let root = TestUtils.renderIntoDocument(
      <RootWithContext isFetching={true}/>
    ) as Root;

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
      <RootWithContext error={fetchError}/>
    ) as Root;

    let error = TestUtils.findRenderedDOMComponentWithClass(root, "error");
    expect(error.textContent).toContain("test error url");
  });

  it("shows book detail", () => {
    let bookData = groupedCollectionData.lanes[0].books[0];
    let root = TestUtils.renderIntoDocument(
      <RootWithContext bookData={bookData}/>
    ) as Root;
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
      <RootWithContext collectionData={ungroupedCollectionData} history={history} />
    ) as Root;

    let breadcrumbs = TestUtils.findRenderedComponentWithType(root, Breadcrumbs);
    expect(breadcrumbs.props.history).toEqual(history);
  });

  describe("provided a BookDetailsContainer", () => {
    class Container extends React.Component<BookDetailsContainerProps, any> {
      render(): JSX.Element {
        return (
          <div className="container">
            {this.props.children}
          </div>
        );
      }
    }

    it("passes props to BookDetailsContainer and renders it", () => {
      let bookData = groupedCollectionData.lanes[0].books[0];
      let refresh = jest.genMockFunction();
      let root = TestUtils.renderIntoDocument(
        <RootWithContext
          bookData={bookData}
          bookUrl={bookData.url}
          collectionUrl="test collection"
          refreshCollectionAndBook={refresh}
          setCollectionAndBook={jest.genMockFunction()}
          BookDetailsContainer={Container} />
      ) as Root;
      let container = TestUtils.findRenderedComponentWithType(root, Container);
      let element = TestUtils.findRenderedDOMComponentWithClass(root, "container");
      container.props.refreshBrowser();
      expect(container.props.bookUrl).toBe(bookData.url);
      expect(container.props.collectionUrl).toBe("test collection");
      expect(refresh.mock.calls.length).toBe(1);
      expect(element.textContent).toContain(bookData.title);
    });

    it("does not render BookDetailsContainer if bookUrl is missing", () => {
      let bookData = groupedCollectionData.lanes[0].books[0];
      let refresh = jest.genMockFunction();
      let root = TestUtils.renderIntoDocument(
        <RootWithContext
          bookData={bookData}
          bookUrl={null}
          collectionUrl="test collection"
          refreshCollectionAndBook={refresh}
          setCollectionAndBook={jest.genMockFunction()}
          BookDetailsContainer={Container} />
      ) as Root;
      let containers = TestUtils.scryRenderedComponentsWithType(root, Container);
      expect(containers.length).toBe(0);
    });
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
      <RootWithContext
        collectionData={collectionData}
        bookData={bookData}
        pageTitleTemplate={pageTitleTemplate} />,
      elem
    ) as Root;

    // template should be invoked by componentWillMount
    expect(pageTitleTemplate.mock.calls.length).toBe(1);
    expect(pageTitleTemplate.mock.calls[0][0]).toBe(collectionData.title);
    expect(pageTitleTemplate.mock.calls[0][1]).toBe(bookData.title);
    expect(document.title).toBe("testing " + collectionData.title + ", " + bookData.title);

    ReactDOM.render(
      <RootWithContext collectionData={null} bookData={null} pageTitleTemplate={pageTitleTemplate} />,
      elem
    ) as Root;

    // template should be invoked again by componentWillUpdate
    expect(pageTitleTemplate.mock.calls.length).toBe(2);
    expect(pageTitleTemplate.mock.calls[1][0]).toBe(null);
    expect(pageTitleTemplate.mock.calls[1][1]).toBe(null);
    expect(document.title).toBe("testing null, null");
  });

  it("calls showPrevBook() on left key press but not if meta key is also presssed", () => {
    let showPrevBook = jest.genMockFunction();
    let root;
    TestUtils.renderIntoDocument<RootProps>(
      <RootWithContext
        ref={c => root = c}
        bookUrl="test book"
        collectionUrl="test collection"
        setCollectionAndBook={jest.genMockFunction()}
        />
    );
    root.getWrappedInstance().showPrevBook = showPrevBook;

    document.dispatchEvent(new KeyboardEvent("keydown", {
      code: "ArrowLeft"
    } as any));

    expect(showPrevBook.mock.calls.length).toBe(1);

    document.dispatchEvent(new KeyboardEvent("keydown", {
      code: "ArrowLeft",
      ctrlKey: true
    } as any));

    expect(showPrevBook.mock.calls.length).toBe(1);
  });

  it("calls showNextBook() on right key press but not if meta key is also presssed", () => {
    let showNextBook = jest.genMockFunction();
    let root;
    TestUtils.renderIntoDocument(
      <RootWithContext
        ref={c => root = c}
        bookUrl="test book"
        collectionUrl="test collection"
        setCollectionAndBook={jest.genMockFunction()}
        />
    ) as Root;
    root.getWrappedInstance().showNextBook = showNextBook;

    document.dispatchEvent(new KeyboardEvent("keydown", {
      code: "ArrowRight"
    } as any));

    expect(showNextBook.mock.calls.length).toBe(1);

    document.dispatchEvent(new KeyboardEvent("keydown", {
      code: "ArrowRight",
      altKey: true
    } as any));

    expect(showNextBook.mock.calls.length).toBe(1);
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
        let TestCollectionLink = this.props.CollectionLink;
        return (
          <div className="header">
            { this.props.children }
            <TestCollectionLink
              text="test"
              url="test url"
              navigate={navigate}
              pathFor={(collection, book) => "#"}
              />
          </div>
        );
      }
    }

    beforeEach(() => {
      root = TestUtils.renderIntoDocument(
        <RootWithContext
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
      let link = TestUtils.findRenderedComponentWithType(header, HeaderCollectionLink);
      expect(header).toBeTruthy();
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

  describe("showNextBook()", () => {
    let mockPush;
    let pathFor;
    let collectionData;
    let bookData;
    let nextBookData;
    let prevBookData;
    let root;

    beforeEach(() => {
      mockPush = jest.genMockFunction();
      pathFor = (c, b) => c + "::" + b;
      collectionData = groupedCollectionData;
    });

    it("navigates to second book if currently showing first book", () => {
      bookData = groupedCollectionData.lanes[0].books[0];
      nextBookData = groupedCollectionData.lanes[0].books[1];
      // NOT WORKING B/C RootWithContext doesn't have showNextBook() defined
      root = TestUtils.renderIntoDocument(
        <RootWithContext
          collectionData={collectionData}
          bookData={bookData}
          setCollectionAndBook={jest.genMockFunction()}
          push={mockPush}
          pathFor={pathFor}
          />
      ) as Root;
      root.getWrappedInstance().showNextBook();

      expect(mockPush.mock.calls.length).toBe(1);
      expect(mockPush.mock.calls[0][0]).toBe(pathFor(collectionData.url, nextBookData.url));
    });

    it("navigates to first book if currently showing last book", () => {
      let lastIndex = groupedCollectionData.lanes[0].books.length - 1;
      bookData = groupedCollectionData.lanes[0].books[lastIndex];
      nextBookData = groupedCollectionData.lanes[0].books[0];
      root = TestUtils.renderIntoDocument(
        <RootWithContext
          collectionData={collectionData}
          bookData={bookData}
          setCollectionAndBook={jest.genMockFunction()}
          push={mockPush}
          pathFor={pathFor}
          />
      ) as Root;
      root.getWrappedInstance().showNextBook();

      expect(mockPush.mock.calls.length).toBe(1);
      expect(mockPush.mock.calls[0][0]).toBe(pathFor(collectionData.url, nextBookData.url));
    });
  });

  describe("showPrevBook()", () => {
    let mockPush;
    let pathFor;
    let collectionData;
    let bookData;
    let nextBookData;
    let prevBookData;
    let root;

    beforeEach(() => {
      mockPush = jest.genMockFunction();
      pathFor = (c, b) => c + "::" + b;
      collectionData = groupedCollectionData;
    });

    it("navigates to last book if currently showing first book", () => {
      let lastIndex = groupedCollectionData.lanes[0].books.length - 1;
      bookData = groupedCollectionData.lanes[0].books[0];
      prevBookData = groupedCollectionData.lanes[0].books[lastIndex];
      root = TestUtils.renderIntoDocument(
        <RootWithContext
          collectionData={collectionData}
          bookData={bookData}
          setCollectionAndBook={jest.genMockFunction()}
          push={mockPush}
          pathFor={pathFor}
          />
      ) as Root;
      root.getWrappedInstance().showPrevBook();

      expect(mockPush.mock.calls.length).toBe(1);
      expect(mockPush.mock.calls[0][0]).toBe(pathFor(collectionData.url, prevBookData.url));
    });

    it("navigates to first book if currently showing second book", () => {
      bookData = groupedCollectionData.lanes[0].books[1];
      prevBookData = groupedCollectionData.lanes[0].books[0];
      root = TestUtils.renderIntoDocument(
        <RootWithContext
          collectionData={collectionData}
          bookData={bookData}
          setCollectionAndBook={jest.genMockFunction()}
          push={mockPush}
          pathFor={pathFor}
          />
      ) as Root;
      root.getWrappedInstance().showPrevBook();

      expect(mockPush.mock.calls.length).toBe(1);
      expect(mockPush.mock.calls[0][0]).toBe(pathFor(collectionData.url, prevBookData.url));
    });
  });

  describe("connected to store", () => {
    let store: Redux.Store;
    let collectionData: CollectionData = groupedCollectionData;
    let bookData: BookData = groupedCollectionData.lanes[0].books[0];
    let push, pathFor;
    let root, rootInstance;
    const ConnectedRootWithContext = withRouterContext<RootProps>(ConnectedRoot);

    beforeEach(() => {
      store = buildStore();
      push = jest.genMockFunction();
      pathFor = (c, b) => c + "::" + b;

      TestUtils.renderIntoDocument(
        <ConnectedRootWithContext
          store={store}
          ref={(c) => root = c}
          push={push}
          pathFor={pathFor}
          collectionData={collectionData} />
      ) as React.Component<any, any>;
      rootInstance = root.getWrappedInstance();
    });

    it("uses router to show a collection", () => {
      let collectionLink = TestUtils.scryRenderedDOMComponentsWithClass(rootInstance, "laneTitle")[0];
      let collectionUrl = collectionData.lanes[0].url;
      TestUtils.Simulate.click(collectionLink, { button: 0 });

      expect(push.mock.calls.length).toBe(1);
      expect(push.mock.calls[0][0].pathname).toBe(pathFor(collectionUrl, null));
    });

    it("uses router to show a book", () => {
      let bookLink =  TestUtils.scryRenderedDOMComponentsWithClass(rootInstance, "laneBookLink")[0];
      let collectionUrl = collectionData.url;
      let bookUrl = collectionData.lanes[0].books[0].url;
      TestUtils.Simulate.click(bookLink, { button: 0 });

      expect(push.mock.calls.length).toBe(1);
      expect(push.mock.calls[0][0].pathname).toBe(pathFor(collectionUrl, bookUrl));
    });

    it("uses router to hide a book", () => {
      push = jest.genMockFunction();
      TestUtils.renderIntoDocument(
        <ConnectedRootWithContext
          store={store}
          ref={(c) => root = c}
          push={push}
          pathFor={pathFor}
          collectionData={collectionData}
          bookData={bookData} />
      ) as React.Component<any, any>;
      rootInstance = root.getWrappedInstance();

      let collectionLink = TestUtils.findRenderedDOMComponentWithClass(rootInstance, "currentCollectionLink");
      let collectionUrl = collectionData.url;
      TestUtils.Simulate.click(collectionLink, { button: 0 });

      expect(push.mock.calls.length).toBe(1);
      expect(push.mock.calls[0][0].pathname).toBe(pathFor(collectionUrl, null));
    });
  });
});