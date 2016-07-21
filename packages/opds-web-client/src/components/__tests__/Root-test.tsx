jest.autoMockOff();
jest.mock("../../DataFetcher");

import * as React from "react";
import { Store } from "redux";
import { shallow, mount } from "enzyme";

import ConnectedRoot, { Root, BookDetailsContainerProps, HeaderProps } from "../Root";
import Breadcrumbs, { ComputeBreadcrumbs } from "../Breadcrumbs";
import Collection from "../Collection";
import UrlForm from "../UrlForm";
import BookDetails from "../BookDetails";
import SkipNavigationLink from "../SkipNavigationLink";
import CatalogLink, { CatalogLinkProps } from "../CatalogLink";
import Search from "../Search";
import LoadingIndicator from "../LoadingIndicator";
import ErrorMessage from "../ErrorMessage";
import BasicAuthForm from "../BasicAuthForm";
import { groupedCollectionData, ungroupedCollectionData } from "./collectionData";
import buildStore from "../../store";
import { State } from "../../state";
import { CollectionData, BookData, LinkData } from "../../interfaces";
import { mockRouterContext } from "./routing";


describe("Root", () => {
  it("shows skip navigation link", () => {
    let wrapper = shallow(
      <Root />
    );

    let links = wrapper.find(SkipNavigationLink);
    expect(links.length).toBe(1);
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
    let fetchSearchDescription = (url: string) => {};
    let wrapper = shallow(
      <Root
        collectionData={collectionData}
        fetchSearchDescription={fetchSearchDescription}
        />
    );

    let search = wrapper.find(Search);
    expect(search.props().url).toBe(collectionData.search.url);
    expect(search.props().searchData).toBe(collectionData.search.searchData);
    expect(search.props().fetchSearchDescription).toBe(fetchSearchDescription);
  });

  it("shows a collection if props include collectionData", () => {
    let collectionData: CollectionData = groupedCollectionData;
    let wrapper = shallow(
      <Root collectionData={collectionData} />
    );

    let collections = wrapper.find(Collection);
    expect(collections.length).toBe(1);
    expect(collections.first().props().collection).toBe(collectionData);
  });

  it("shows a url form if no collection url or book url", () => {
    let wrapper = shallow(
        <Root />
    );

    let urlForms = wrapper.find(UrlForm);
    expect(urlForms.length).toBe(1);
  });

  it("doesn't show a url form if collection url", () => {
    let wrapper = shallow(
      <Root collectionUrl="test" setCollectionAndBook={jest.genMockFunction()} />
    );

    let urlForms = wrapper.find(UrlForm);
    expect(urlForms.length).toBe(0);
  });

  it("doesn't show a url form if book url", () => {
    let wrapper = shallow(
      <Root bookUrl="test" setCollectionAndBook={jest.genMockFunction()} />
    );

    let urlForms = wrapper.find(UrlForm);
    expect(urlForms.length).toBe(0);
  });

  it("fetches a collection url on mount", () => {
    let collectionUrl = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let setCollectionAndBook = jest.genMockFunction();
    let wrapper = shallow(
      <Root collectionUrl={collectionUrl} setCollectionAndBook={setCollectionAndBook}/>
    );

    expect(setCollectionAndBook.mock.calls.length).toBe(1);
    expect(setCollectionAndBook.mock.calls[0][0]).toBe(collectionUrl);
    expect(setCollectionAndBook.mock.calls[0][1]).toBeFalsy();
  });

  it("fetches a book url on mount", () => {
    let bookUrl = "http://example.com/book";
    let setCollectionAndBook = jest.genMockFunction();
    let wrapper = shallow(
      <Root bookUrl={bookUrl} setCollectionAndBook={setCollectionAndBook}/>
    );

    expect(setCollectionAndBook.mock.calls.length).toBe(1);
    expect(setCollectionAndBook.mock.calls[0][0]).toBeFalsy();
    expect(setCollectionAndBook.mock.calls[0][1]).toBe(bookUrl);
  });

  it("updates page title on mount", () => {
    let wrapper = shallow(
      <Root pageTitleTemplate={(collection, book) => "page title"} />
    );
    expect(document.title).toBe("page title");
  });

  it("sets basic auth credentials on mount", () => {
    let saveBasicAuthCredentials = jest.genMockFunction();
    let wrapper = shallow(
      <Root saveBasicAuthCredentials={saveBasicAuthCredentials} />
    );
    expect(saveBasicAuthCredentials.mock.calls.length).toBe(1);
    expect(saveBasicAuthCredentials.mock.calls[0][0]).toBe("credentials");
  });

  it("fetches a collection url when updated", () => {
    let elem = document.createElement("div");
    let collectionUrl = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let newCollection = "new collection url";
    let setCollectionAndBook = jest.genMockFunction();
    let wrapper = shallow(
      <Root collectionUrl={collectionUrl} setCollectionAndBook={setCollectionAndBook} />
    );
    wrapper.setProps({
      collectionUrl: newCollection
    });

    expect(setCollectionAndBook.mock.calls.length).toBe(2);
    expect(setCollectionAndBook.mock.calls[1][0]).toBe(newCollection);
    expect(setCollectionAndBook.mock.calls[1][1]).toBeFalsy();
  });

  it("shows loading message", () => {
    let wrapper = shallow(
      <Root isFetching={true}/>
    );

    let loadings = wrapper.find(LoadingIndicator);
    expect(loadings.length).toBe(1);
  });

  it("shows error message", () => {
    let fetchError = {
      status: 500,
      response: "test error",
      url: "test error url"
    };
    let retry = jest.genMockFunction();
    let wrapper = shallow(
      <Root error={fetchError} retryCollectionAndBook={retry} />
    );

    let error = wrapper.find(ErrorMessage);
    expect(error.props().message).toContain(fetchError.url);
    expect(error.props().retry).toBe(retry);
  });

  it("shows basic auth form", () => {
    let basicAuth = {
      showForm: true,
      credentials: "gibberish",
      title: "Super Classified Archive",
      loginLabel: "Clearance ID",
      passwordLabel: "Access Key",
      error: "Invalid Clearance ID and/or Access Key",
      callback: jest.genMockFunction(),
      isFetching: false
    };
    let saveBasicAuthCredentials = jest.genMockFunction();
    let hideBasicAuthForm = jest.genMockFunction();
    let wrapper = shallow(
      <Root
        basicAuth={basicAuth}
        saveBasicAuthCredentials={saveBasicAuthCredentials}
        hideBasicAuthForm={hideBasicAuthForm}
        />
    );
    let form = wrapper.find(BasicAuthForm);
    let {
      saveCredentials, hide, callback, title, loginLabel, passwordLabel, error
    } = form.props();
    expect(saveCredentials).toBe(saveBasicAuthCredentials);
    expect(hide).toBe(hideBasicAuthForm);
    expect(callback).toBe(basicAuth.callback);
    expect(title).toBe(basicAuth.title);
    expect(loginLabel).toBe(basicAuth.loginLabel);
    expect(passwordLabel).toBe(basicAuth.passwordLabel);
    expect(error).toBe(basicAuth.error);
  });

  it("shows book detail", () => {
    let bookData = groupedCollectionData.lanes[0].books[0];
    let wrapper = shallow(
      <Root bookData={bookData}/>
    );

    let bookWrapper = wrapper.find(".bookDetailsWrapper");
    let book = wrapper.find(BookDetails);

    expect(bookWrapper.length).toBe(1);
    expect(book.props().book).toBe(bookData);
  });

  it("shows breadcrumbs", () => {
    let history: LinkData[] = [{
      id: "2nd id",
      text: "2nd title",
      url: "2nd url"
    }, {
      id: "last id",
      text: "last title",
      url: "last url"
    }];

    let wrapper = shallow(
      <Root collectionData={ungroupedCollectionData} history={history} />
    );

    let breadcrumbs = wrapper.find(Breadcrumbs);
    let links = history.concat([{
      url: ungroupedCollectionData.url,
      text: ungroupedCollectionData.title
    }]);
    expect(breadcrumbs.props().links).toEqual(links);
  });

  it("uses custom computeBreadcrumbs function", () => {
    let breadcrumb = {
      url: "breacrumb url",
      text: "breadcrumb text"
    };
    let computeBreadcrumbs = (data) => [breadcrumb];
    let wrapper = shallow(
      <Root
        collectionData={ungroupedCollectionData}
        computeBreadcrumbs={computeBreadcrumbs} />
    );
    let breadcrumbs = wrapper.find(Breadcrumbs);

    expect(breadcrumbs.props().links).toEqual([breadcrumb]);
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

    it("renders BookDetailsContainer with urls, refresh, and book details", () => {
      let bookData = groupedCollectionData.lanes[0].books[0];
      let refresh = jest.genMockFunction();
      let borrowAndFulfillBook = jest.genMockFunction();
      let fulfillBook = jest.genMockFunction();
      let wrapper = shallow(
        <Root
          bookData={bookData}
          bookUrl={bookData.url}
          collectionUrl="test collection"
          refreshCollectionAndBook={refresh}
          setCollectionAndBook={jest.genMockFunction()}
          BookDetailsContainer={Container}
          borrowAndFulfillBook={borrowAndFulfillBook}
          fulfillBook={fulfillBook}
          />
      );

      let container = wrapper.find(Container);
      let child = container.children().first();
      expect(container.props().bookUrl).toBe(bookData.url);
      expect(container.props().collectionUrl).toBe("test collection");
      expect(container.props().refreshCatalog).toBe(refresh);
      expect(container.props().borrowAndFulfillBook).toBe(borrowAndFulfillBook);
      expect(container.props().fulfillBook).toBe(fulfillBook);
      expect(child.type()).toBe(BookDetails);
      expect(child.props().book).toBe(bookData);
    });

    it("does not render BookDetailsContainer if bookUrl and bookData.url are missing", () => {
      let bookData = Object.assign({}, groupedCollectionData.lanes[0].books[0], { url: null });
      let refresh = jest.genMockFunction();
      let wrapper = shallow(
        <Root
          bookData={bookData}
          bookUrl={null}
          collectionUrl="test collection"
          refreshCollectionAndBook={refresh}
          setCollectionAndBook={jest.genMockFunction()}
          BookDetailsContainer={Container} />
      );
      let containers = wrapper.find(Container);
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
    let wrapper = shallow(
      <Root
        collectionData={collectionData}
        bookData={bookData}
        pageTitleTemplate={pageTitleTemplate} />
    );

    // template should be invoked by componentWillMount
    expect(pageTitleTemplate.mock.calls.length).toBe(1);
    expect(pageTitleTemplate.mock.calls[0][0]).toBe(collectionData.title);
    expect(pageTitleTemplate.mock.calls[0][1]).toBe(bookData.title);
    expect(document.title).toBe("testing " + collectionData.title + ", " + bookData.title);

    wrapper.setProps({
      collectionData: null,
      bookData: null,
      pageTitleTemplate: pageTitleTemplate
    });

    // template should be invoked again by componentWillUpdate
    expect(pageTitleTemplate.mock.calls.length).toBe(2);
    expect(pageTitleTemplate.mock.calls[1][0]).toBe(null);
    expect(pageTitleTemplate.mock.calls[1][1]).toBe(null);
    expect(document.title).toBe("testing null, null");
  });

  it("calls showPrevBook() on left key press but not if meta key is also presssed", () => {
    let showPrevBook = jest.genMockFunction();
    let context = mockRouterContext();
    let wrapper = mount(
      <Root
        bookUrl="test book"
        collectionUrl="test collection"
        setCollectionAndBook={jest.genMockFunction()}
        />,
      { context }
    ) as any;
    wrapper.instance().showPrevBook = showPrevBook;

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
    let context = mockRouterContext();
    let wrapper = mount(
      <Root
        bookUrl="test book"
        collectionUrl="test collection"
        setCollectionAndBook={jest.genMockFunction()}
        />,
      { context }
    ) as any;
    wrapper.instance().showNextBook = showNextBook;

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
    let wrapper;
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
    let bookData: BookData = ungroupedCollectionData.books[0];
    let showBasicAuthForm;
    let clearBasicAuthCredentials;

    class Header extends React.Component<HeaderProps, any> {
      render(): JSX.Element {
        let TestCatalogLink = this.props.CatalogLink;
        return (
          <div className="header">
            { this.props.children }
            <TestCatalogLink collectionUrl="test url">
              test
            </TestCatalogLink>
          </div>
        );
      }
    }

    beforeEach(() => {
      wrapper = shallow(
        <Root
          Header={Header}
          collectionData={collectionData}
          bookData={bookData}
          fetchSearchDescription={(url: string) => {}}
          showBasicAuthForm={showBasicAuthForm}
          isSignedIn={true}
          />
      );
    });

    it("renders the header", () => {
      let header = wrapper.find(Header);
      let search = header.childAt(0);
      expect(header.props().CatalogLink).toBe(CatalogLink);
      expect(header.props().collectionTitle).toBe(collectionData.title);
      expect(header.props().bookTitle).toBe(bookData.title);
      expect(header.props().isSignedIn).toBe(true);
      expect(header.props().showBasicAuthForm).toBe(showBasicAuthForm);
      expect(header.props().clearBasicAuthCredentials).toBe(clearBasicAuthCredentials);
      expect(search.type()).toBe(Search);
    });
  });

  describe("showNextBook()", () => {
    let mockPush;
    let context;
    let collectionData;
    let bookData;
    let nextBookData;
    let prevBookData;
    let wrapper;

    beforeEach(() => {
      mockPush = jest.genMockFunction();
      context = mockRouterContext(mockPush);
      collectionData = groupedCollectionData;
    });

    it("navigates to second book if currently showing first book", () => {
      bookData = groupedCollectionData.lanes[0].books[0];
      nextBookData = groupedCollectionData.lanes[0].books[1];
      wrapper = shallow(
        <Root
          collectionData={collectionData}
          bookData={bookData}
          setCollectionAndBook={jest.genMockFunction()}
          />,
        { context }
      ) as any;
      wrapper.instance().showNextBook();

      expect(mockPush.mock.calls.length).toBe(1);
      expect(mockPush.mock.calls[0][0]).toBe(context.pathFor(collectionData.url, nextBookData.url));
    });

    it("navigates to first book if currently showing last book", () => {
      let lastIndex = groupedCollectionData.lanes[0].books.length - 1;
      bookData = groupedCollectionData.lanes[0].books[lastIndex];
      nextBookData = groupedCollectionData.lanes[0].books[0];
      wrapper = shallow(
        <Root
          collectionData={collectionData}
          bookData={bookData}
          setCollectionAndBook={jest.genMockFunction()}
          />,
        { context }
      ) as any;
      wrapper.instance().showNextBook();

      expect(mockPush.mock.calls.length).toBe(1);
      expect(mockPush.mock.calls[0][0]).toBe(context.pathFor(collectionData.url, nextBookData.url));
    });
  });

  describe("showPrevBook()", () => {
    let mockPush;
    let context;
    let collectionData;
    let bookData;
    let nextBookData;
    let prevBookData;
    let wrapper;

    beforeEach(() => {
      mockPush = jest.genMockFunction();
      context = mockRouterContext(mockPush);
      collectionData = groupedCollectionData;
    });

    it("navigates to last book if currently showing first book", () => {
      let lastIndex = groupedCollectionData.lanes[0].books.length - 1;
      bookData = groupedCollectionData.lanes[0].books[0];
      prevBookData = groupedCollectionData.lanes[0].books[lastIndex];
      wrapper = shallow(
        <Root
          collectionData={collectionData}
          bookData={bookData}
          setCollectionAndBook={jest.genMockFunction()}
          />,
        { context }
      ) as any;
      wrapper.instance().showPrevBook();

      expect(mockPush.mock.calls.length).toBe(1);
      expect(mockPush.mock.calls[0][0]).toBe(context.pathFor(collectionData.url, prevBookData.url));
    });

    it("navigates to first book if currently showing second book", () => {
      bookData = groupedCollectionData.lanes[0].books[1];
      prevBookData = groupedCollectionData.lanes[0].books[0];
      wrapper = shallow(
        <Root
          collectionData={collectionData}
          bookData={bookData}
          setCollectionAndBook={jest.genMockFunction()}
          />,
        { context }
      ) as any;
      wrapper.instance().showPrevBook();

      expect(mockPush.mock.calls.length).toBe(1);
      expect(mockPush.mock.calls[0][0]).toBe(context.pathFor(collectionData.url, prevBookData.url));
    });
  });

  describe("routing", () => {
    let store: Store<State>;
    let collectionData: CollectionData = groupedCollectionData;
    let bookData: BookData = groupedCollectionData.lanes[0].books[0];
    let push, context, childContextTypes;
    let wrapper, root;
    let history;

    beforeEach(() => {
      push = jest.genMockFunction();
      context = mockRouterContext(push);
      childContextTypes = {
        router: React.PropTypes.object.isRequired,
        pathFor: React.PropTypes.func.isRequired
      };
      history = [{
        text: "root title",
        url: "root url"
      }, {
        text: "some title",
        url: "some url"
      }];

      wrapper = mount(
        <Root
          collectionData={collectionData}
          bookData={null}
          history={history}
          />,
        { context, childContextTypes }
      ) as any;
    });

    it("uses router to show a collection", () => {
      let collectionLink = wrapper.find(".laneTitle").first();
      let collectionUrl = collectionData.lanes[0].url;
      collectionLink.simulate("click", { button: 0 });

      expect(push.mock.calls.length).toBe(1);
      expect(push.mock.calls[0][0]).toBe(context.pathFor(collectionUrl, null));
    });

    it("uses router to show a book", () => {
      let bookLink =  wrapper.find(".laneBookLink").first();
      let collectionUrl = collectionData.url;
      let bookUrl = collectionData.lanes[0].books[0].url;
      bookLink.simulate("click", { button: 0 });

      expect(push.mock.calls.length).toBe(1);
      expect(push.mock.calls[0][0]).toBe(context.pathFor(collectionUrl, bookUrl));
    });

    it("uses router to hide a book", () => {
      wrapper.setProps({ bookData });

      let collectionLink = wrapper.find("ol.breadcrumb").find(CatalogLink).last();
      let collectionUrl = collectionData.url;
      collectionLink.simulate("click", { button: 0 });

      expect(push.mock.calls.length).toBe(1);
      expect(push.mock.calls[0][0]).toBe(context.pathFor(collectionUrl, null));
    });
  });
});