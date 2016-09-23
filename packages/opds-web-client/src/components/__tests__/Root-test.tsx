import { expect } from "chai";
import { stub, spy } from "sinon";

import * as React from "react";
import { Store } from "redux";
import { shallow, mount } from "enzyme";

import ConnectedRoot, { Root, BookDetailsContainerProps, HeaderProps, FooterProps } from "../Root";
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

const setCollectionAndBookPromise = new Promise((resolve, reject) => {
  resolve({
    collectionData: null,
    bookData: null
  });
});
const mockSetCollectionAndBook = stub().returns(setCollectionAndBookPromise);

describe("Root", () => {
  it("shows skip navigation link", () => {
    let wrapper = shallow(
      <Root />
    );

    let links = wrapper.find(SkipNavigationLink);
    expect(links.length).to.equal(1);
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
    expect(search.props().url).to.equal(collectionData.search.url);
    expect(search.props().searchData).to.equal(collectionData.search.searchData);
    expect(search.props().fetchSearchDescription).to.equal(fetchSearchDescription);
  });

  it("shows a collection if props include collectionData", () => {
    let collectionData: CollectionData = groupedCollectionData;
    let wrapper = shallow(
      <Root collectionData={collectionData} />
    );

    let collections = wrapper.find(Collection);
    expect(collections.length).to.equal(1);
    expect(collections.first().props().collection).to.equal(collectionData);
  });

  it("shows a url form if no collection url or book url", () => {
    let wrapper = shallow(
        <Root />
    );

    let urlForms = wrapper.find(UrlForm);
    expect(urlForms.length).to.equal(1);
  });

  it("doesn't show a url form if collection url", () => {
    let wrapper = shallow(
      <Root collectionUrl="test" setCollectionAndBook={mockSetCollectionAndBook} />
    );

    let urlForms = wrapper.find(UrlForm);
    expect(urlForms.length).to.equal(0);
  });

  it("doesn't show a url form if book url", () => {
    let wrapper = shallow(
      <Root bookUrl="test" setCollectionAndBook={mockSetCollectionAndBook} />
    );

    let urlForms = wrapper.find(UrlForm);
    expect(urlForms.length).to.equal(0);
  });

  it("fetches a collection url on mount", () => {
    let collectionUrl = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let setCollectionAndBook = stub().returns(setCollectionAndBookPromise);
    let wrapper = shallow(
      <Root collectionUrl={collectionUrl} setCollectionAndBook={setCollectionAndBook}/>
    );

    expect(setCollectionAndBook.callCount).to.equal(1);
    expect(setCollectionAndBook.args[0][0]).to.equal(collectionUrl);
    expect(setCollectionAndBook.args[0][1]).not.to.be.ok;
  });

  it("fetches a book url on mount", () => {
    let bookUrl = "http://example.com/book";
    let setCollectionAndBook = stub().returns(setCollectionAndBookPromise);
    let wrapper = shallow(
      <Root bookUrl={bookUrl} setCollectionAndBook={setCollectionAndBook}/>
    );

    expect(setCollectionAndBook.callCount).to.equal(1);
    expect(setCollectionAndBook.args[0][0]).not.to.be.ok;
    expect(setCollectionAndBook.args[0][1]).to.equal(bookUrl);
  });

  it("fetches loans on mount", (done) => {
    let collectionUrl = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let setCollectionAndBook = (collectionUrl, bookUrl) => {
      return new Promise((resolve, reject) => resolve({
        collectionData: Object.assign({}, ungroupedCollectionData, { shelfUrl: "loans url" }),
        bookData: null
      }));
    };
    let fetchLoans = stub();
    let wrapper = shallow(
      <Root
        collectionUrl={collectionUrl}
        setCollectionAndBook={setCollectionAndBook}
        fetchLoans={fetchLoans}
        basicAuthCredentials="credentials"
        />
    );

    (wrapper.instance() as any).componentWillMount().then(() => {
      let count = fetchLoans.callCount;
      expect(fetchLoans.args[count - 1][0]).to.equal("loans url");
      done();
    }).catch(err => { console.log(err); throw(err); });
  });

  it("updates page title on mount", () => {
    let wrapper = shallow(
      <Root pageTitleTemplate={(collection, book) => "page title"} />
    );
    expect(document.title).to.equal("page title");
  });

  it("sets basic auth credentials on mount", () => {
    let saveBasicAuthCredentials = stub();
    let wrapper = shallow(
      <Root
        saveBasicAuthCredentials={saveBasicAuthCredentials}
        basicAuthCredentials="credentials"
        />
    );
    expect(saveBasicAuthCredentials.callCount).to.equal(1);
    expect(saveBasicAuthCredentials.args[0][0]).to.equal("credentials");
  });

  it("fetches a collection url when updated", () => {
    let elem = document.createElement("div");
    let collectionUrl = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let newCollection = "new collection url";
    let setCollectionAndBook = stub().returns(setCollectionAndBookPromise);
    let wrapper = shallow(
      <Root collectionUrl={collectionUrl} setCollectionAndBook={setCollectionAndBook} />
    );
    wrapper.setProps({
      collectionUrl: newCollection
    });

    expect(setCollectionAndBook.callCount).to.equal(2);
    expect(setCollectionAndBook.args[1][0]).to.equal(newCollection);
    expect(setCollectionAndBook.args[1][1]).not.to.be.ok;
  });

  it("shows loading message", () => {
    let wrapper = shallow(
      <Root isFetching={true}/>
    );

    let loadings = wrapper.find(LoadingIndicator);
    expect(loadings.length).to.equal(1);
  });

  it("shows error message", () => {
    let fetchError = {
      status: 500,
      response: "test error",
      url: "test error url"
    };
    let retry = stub();
    let wrapper = shallow(
      <Root error={fetchError} retryCollectionAndBook={retry} />
    );

    let error = wrapper.find(ErrorMessage);
    expect(error.props().message).to.contain(fetchError.url);
    expect(error.props().retry).to.equal(retry);
  });

  it("shows basic auth form", () => {
    let basicAuth = {
      showForm: true,
      credentials: "gibberish",
      title: "Super Classified Archive",
      loginLabel: "Clearance ID",
      passwordLabel: "Access Key",
      error: "Invalid Clearance ID and/or Access Key",
      callback: stub()
    };
    let saveBasicAuthCredentials = stub();
    let closeErrorAndHideBasicAuthForm = stub();
    let wrapper = shallow(
      <Root
        basicAuth={basicAuth}
        saveBasicAuthCredentials={saveBasicAuthCredentials}
        closeErrorAndHideBasicAuthForm={closeErrorAndHideBasicAuthForm}
        />
    );
    let form = wrapper.find(BasicAuthForm);
    let {
      saveCredentials, hide, callback, title, loginLabel, passwordLabel, error
    } = form.props();
    expect(saveCredentials).to.equal(saveBasicAuthCredentials);
    expect(hide).to.equal(closeErrorAndHideBasicAuthForm);
    expect(callback).to.equal(basicAuth.callback);
    expect(title).to.equal(basicAuth.title);
    expect(loginLabel).to.equal(basicAuth.loginLabel);
    expect(passwordLabel).to.equal(basicAuth.passwordLabel);
    expect(error).to.equal(basicAuth.error);
  });

  it("shows book detail", () => {
    let bookData = groupedCollectionData.lanes[0].books[0];
    let loans = [Object.assign({}, bookData, {
      availability: { status: "availabile" }
    })];
    let updateBook = stub();
    let fulfillBook = stub();
    let indirectFulfillBook = stub();
    let wrapper = shallow(
      <Root
        bookData={bookData}
        loans={loans}
        updateBook={updateBook}
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        isSignedIn={true}
        />
    );

    let bookWrapper = wrapper.find(".book-details-wrapper");
    let book = wrapper.find(BookDetails);

    expect(bookWrapper.length).to.equal(1);
    expect(book.props().book).to.equal(loans[0]);
    expect(book.props().updateBook).to.equal(updateBook);
    expect(book.props().fulfillBook).to.equal(fulfillBook);
    expect(book.props().indirectFulfillBook).to.equal(indirectFulfillBook);
    expect(book.props().isSignedIn).to.equal(true);
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
    expect(breadcrumbs.props().links).to.deep.equal(links);
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

    expect(breadcrumbs.props().links).to.deep.equal([breadcrumb]);
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
      let refresh = stub();
      let updateBook = stub();
      let fulfillBook = stub();
      let wrapper = shallow(
        <Root
          bookData={bookData}
          bookUrl={bookData.url}
          collectionUrl="test collection"
          refreshCollectionAndBook={refresh}
          setCollectionAndBook={mockSetCollectionAndBook}
          BookDetailsContainer={Container}
          updateBook={updateBook}
          fulfillBook={fulfillBook}
          />
      );

      let container = wrapper.find(Container);
      let child = container.children().first();
      expect(container.props().bookUrl).to.equal(bookData.url);
      expect(container.props().collectionUrl).to.equal("test collection");
      expect(container.props().refreshCatalog).to.equal(refresh);
      expect(container.props().book).to.equal(bookData);
      expect(child.type()).to.equal(BookDetails);
      expect(child.props().book).to.equal(bookData);
    });

    it("does not render BookDetailsContainer if bookUrl and bookData.url are missing", () => {
      let bookData = Object.assign({}, groupedCollectionData.lanes[0].books[0], { url: null });
      let refresh = stub();
      let wrapper = shallow(
        <Root
          bookData={bookData}
          bookUrl={null}
          collectionUrl="test collection"
          refreshCollectionAndBook={refresh}
          setCollectionAndBook={mockSetCollectionAndBook}
          BookDetailsContainer={Container} />
      );
      let containers = wrapper.find(Container);
      expect(containers.length).to.equal(0);
    });
  });

  it("sets page title after updating", () => {
    let elem = document.createElement("div");
    let collectionData = ungroupedCollectionData;
    let bookData = collectionData.books[0];
    let pageTitleTemplate = spy((collectionTitle, bookTitle) => {
      return "testing " + collectionTitle + ", " + bookTitle;
    });
    let wrapper = shallow(
      <Root
        collectionData={collectionData}
        bookData={bookData}
        pageTitleTemplate={pageTitleTemplate} />
    );

    // template should be invoked by componentWillMount
    expect(pageTitleTemplate.callCount).to.equal(1);
    expect(pageTitleTemplate.args[0][0]).to.equal(collectionData.title);
    expect(pageTitleTemplate.args[0][1]).to.equal(bookData.title);
    expect(document.title).to.equal("testing " + collectionData.title + ", " + bookData.title);

    wrapper.setProps({
      collectionData: null,
      bookData: null,
      pageTitleTemplate: pageTitleTemplate
    });

    // template should be invoked again by componentWillUpdate
    expect(pageTitleTemplate.callCount).to.equal(2);
    expect(pageTitleTemplate.args[1][0]).to.equal(null);
    expect(pageTitleTemplate.args[1][1]).to.equal(null);
    expect(document.title).to.equal("testing null, null");
  });

  it("calls showPrevBook() on left key press but not if meta key is also presssed", () => {
    let showPrevBook = stub();
    let context = mockRouterContext();
    let wrapper = mount(
      <Root
        bookUrl="test book"
        collectionUrl="test collection"
        setCollectionAndBook={mockSetCollectionAndBook}
        />,
      { context }
    ) as any;
    wrapper.instance().showPrevBook = showPrevBook;

    document.dispatchEvent(new (window as any).KeyboardEvent("keydown", {
      code: "ArrowLeft"
    } as any));

    expect(showPrevBook.callCount).to.equal(1);

    document.dispatchEvent(new (window as any).KeyboardEvent("keydown", {
      code: "ArrowLeft",
      ctrlKey: true
    } as any));

    expect(showPrevBook.callCount).to.equal(1);
  });

  it("calls showNextBook() on right key press but not if meta key is also pressed", () => {
    let showNextBook = stub();
    let context = mockRouterContext();
    let wrapper = mount(
      <Root
        bookUrl="test book"
        collectionUrl="test collection"
        setCollectionAndBook={mockSetCollectionAndBook}
        />,
      { context }
    ) as any;
    wrapper.instance().showNextBook = showNextBook;

    document.dispatchEvent(new (window as any).KeyboardEvent("keydown", {
      code: "ArrowRight"
    } as any));

    expect(showNextBook.callCount).to.equal(1);

    document.dispatchEvent(new (window as any).KeyboardEvent("keydown", {
      code: "ArrowRight",
      altKey: true
    } as any));

    expect(showNextBook.callCount).to.equal(1);
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
        return (
          <div className="header">
            { this.props.children }
            <CatalogLink collectionUrl="test url">
              test
            </CatalogLink>
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
          loansUrl="loans"
          />
      );
    });

    it("renders the header", () => {
      let header = wrapper.find(Header);
      let search = header.childAt(0);
      expect(header.props().collectionTitle).to.equal(collectionData.title);
      expect(header.props().bookTitle).to.equal(bookData.title);
      expect(header.props().isSignedIn).to.equal(true);
      expect(header.props().showBasicAuthForm).to.equal(showBasicAuthForm);
      expect(header.props().clearBasicAuthCredentials).to.equal(clearBasicAuthCredentials);
      expect(header.props().loansUrl).to.equal("loans");
      expect(search.type()).to.equal(Search);
    });
  });

  describe("when given a footer component", () => {
    let wrapper;
    let collectionData = ungroupedCollectionData;
    let bookData = ungroupedCollectionData.books[0];
    class Footer extends React.Component<FooterProps, any> {
      render(): JSX.Element {
        return (
          <div className="footer" />
        );
      }
    }

    beforeEach(() => {
      wrapper = shallow(
        <Root
          Footer={Footer}
          collectionData={collectionData}
          bookData={bookData}
          fetchSearchDescription={(url: string) => {}}
          />
      );
    });

    it("renders the footer", () => {
      let footer = wrapper.find("footer");
      expect(footer.length).to.equal(1);
      let footerComponent = footer.childAt(0);
      expect(footerComponent.props().collection).to.equal(collectionData);
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
      mockPush = stub();
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
          setCollectionAndBook={mockSetCollectionAndBook}
          />,
        { context }
      ) as any;
      wrapper.instance().showNextBook();

      expect(mockPush.callCount).to.equal(1);
      expect(mockPush.args[0][0]).to.equal(context.pathFor(collectionData.url, nextBookData.url));
    });

    it("navigates to first book if currently showing last book", () => {
      let lastIndex = groupedCollectionData.lanes[0].books.length - 1;
      bookData = groupedCollectionData.lanes[0].books[lastIndex];
      nextBookData = groupedCollectionData.lanes[0].books[0];
      wrapper = shallow(
        <Root
          collectionData={collectionData}
          bookData={bookData}
          setCollectionAndBook={mockSetCollectionAndBook}
          />,
        { context }
      ) as any;
      wrapper.instance().showNextBook();

      expect(mockPush.callCount).to.equal(1);
      expect(mockPush.args[0][0]).to.equal(context.pathFor(collectionData.url, nextBookData.url));
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
      mockPush = stub();
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
          setCollectionAndBook={mockSetCollectionAndBook}
          />,
        { context }
      ) as any;
      wrapper.instance().showPrevBook();

      expect(mockPush.callCount).to.equal(1);
      expect(mockPush.args[0][0]).to.equal(context.pathFor(collectionData.url, prevBookData.url));
    });

    it("navigates to first book if currently showing second book", () => {
      bookData = groupedCollectionData.lanes[0].books[1];
      prevBookData = groupedCollectionData.lanes[0].books[0];
      wrapper = shallow(
        <Root
          collectionData={collectionData}
          bookData={bookData}
          setCollectionAndBook={mockSetCollectionAndBook}
          />,
        { context }
      ) as any;
      wrapper.instance().showPrevBook();

      expect(mockPush.callCount).to.equal(1);
      expect(mockPush.args[0][0]).to.equal(context.pathFor(collectionData.url, prevBookData.url));
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
      push = stub();
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
      let collectionLink = wrapper.find(".lane .title").first();
      let collectionUrl = collectionData.lanes[0].url;
      collectionLink.simulate("click", { button: 0 });

      expect(push.callCount).to.equal(1);
      expect(push.args[0][0]).to.equal(context.pathFor(collectionUrl, null));
    });

    it("uses router to show a book", () => {
      let bookLink =  wrapper.find(".book a").first();
      let collectionUrl = collectionData.url;
      let bookUrl = collectionData.lanes[0].books[0].url;
      bookLink.simulate("click", { button: 0 });

      expect(push.callCount).to.equal(1);
      expect(push.args[0][0]).to.equal(context.pathFor(collectionUrl, bookUrl));
    });

    it("uses router to hide a book", () => {
      wrapper.setProps({ bookData });

      let collectionLink = wrapper.find("ol.breadcrumb").find(CatalogLink).last();
      let collectionUrl = collectionData.url;
      collectionLink.simulate("click", { button: 0 });

      expect(push.callCount).to.equal(1);
      expect(push.args[0][0]).to.equal(context.pathFor(collectionUrl, null));
    });
  });
});