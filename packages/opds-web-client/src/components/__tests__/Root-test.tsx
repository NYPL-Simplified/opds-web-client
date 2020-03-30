import { expect } from "chai";
import { stub, spy } from "sinon";

import * as React from "react";
import * as PropTypes from "prop-types";
import { Store } from "redux";
import { shallow, mount } from "enzyme";

import {
  Root,
  BookDetailsContainerProps,
  HeaderProps,
  FooterProps,
  CollectionContainerProps
} from "../Root";
import Breadcrumbs from "../Breadcrumbs";
import Collection from "../Collection";
import UrlForm from "../UrlForm";
import BookDetails from "../BookDetails";
import SkipNavigationLink from "../SkipNavigationLink";
import CatalogLink from "../CatalogLink";
import Search from "../Search";
import LoadingIndicator from "../LoadingIndicator";
import ErrorMessage from "../ErrorMessage";
import AuthProviderSelectionForm from "../AuthProviderSelectionForm";
import {
  groupedCollectionData,
  ungroupedCollectionData
} from "./collectionData";
import { State } from "../../state";
import { CollectionData, BookData, LinkData } from "../../interfaces";
import { mockRouterContext } from "../../__mocks__/routing";
import AuthPlugin from "../../AuthPlugin";

let book: BookData = {
  id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
  title: "The Mayan Secrets",
  authors: ["Clive Cussler", "Thomas Perry"],
  summary:
    "<strong>Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.</strong><br />Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.<br />The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out.",
  imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
  openAccessLinks: [
    { url: "secrets.epub", type: "application/epub+zip" },
    { url: "secrets.mobi", type: "application/x-mobipocket-ebook" }
  ],
  borrowUrl: "borrow url",
  publisher: "Penguin Publishing Group",
  published: "February 29, 2016",
  categories: ["category 1", "category 2"],
  series: {
    name: "Fake Series"
  },
  language: "de",
  raw: {
    $: { "schema:additionalType": { value: "http://bib.schema.org/Audiobook" } }
  }
};

const setCollectionAndBookPromise = new Promise((resolve, reject) => {
  resolve({
    collectionData: null,
    bookData: null
  });
});
const mockSetCollectionAndBook = stub().returns(setCollectionAndBookPromise);
const fulfillBook = async (url: string): Promise<Blob> => new Blob();
const updateBook = async (url: string): Promise<BookData> => book;
const indirectFulfillBook = async (
  url: string,
  type: string
): Promise<string> => "test value";
const setPreference = () => null;

describe("Root", () => {
  it("shows skip navigation link", () => {
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
      />
    );

    let links = wrapper.find(SkipNavigationLink);
    expect(links.length).to.equal(1);
  });

  it("contains main element", () => {
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
      />
    );

    let main = wrapper.find("main");
    expect(main.props().role).to.equal("main");
  });

  it("shows search and treats it as top-level", () => {
    let collectionData = Object.assign({}, ungroupedCollectionData, {
      search: {
        url: "test search url",
        searchData: {
          description: "description",
          shortName: "shortName",
          template: s => s
        }
      }
    });
    let fetchSearchDescription = (url: string) => {};
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        collectionData={collectionData}
        fetchSearchDescription={fetchSearchDescription}
      />
    );

    let search = wrapper.find(Search);
    expect(search.props().url).to.equal(collectionData.search.url);
    expect(search.props().searchData).to.equal(
      collectionData.search.searchData
    );
    expect(search.props().fetchSearchDescription).to.equal(
      fetchSearchDescription
    );
  });

  it("shows a collection if props include collectionData", () => {
    let collectionData: CollectionData = groupedCollectionData;
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        collectionData={collectionData}
      />
    );

    let collections = wrapper.find(Collection);
    expect(collections.length).to.equal(1);
    expect(collections.first().props().collection).to.deep.equal(
      collectionData
    );
  });

  it("shows a (non-grouped) collection with loans if props include collectionData and loans", () => {
    let collectionData: CollectionData = ungroupedCollectionData;
    // One book is on loan.
    let loan = Object.assign({}, collectionData.books[1], {
      fulfillmentLinks: [{ url: "fulfill", type: "text/html" }]
    });
    let loans = [loan];
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        collectionData={collectionData}
        loans={loans}
      />
    );
    let collections = wrapper.find(Collection);
    expect(collections.length).to.equal(1);
    let expectedBooks = [
      collectionData.books[0],
      loan,
      collectionData.books[2]
    ];
    let expectedCollection = Object.assign({}, collectionData, {
      books: expectedBooks
    });
    expect(collections.first().props().collection).to.deep.equal(
      expectedCollection
    );
  });

  it("shows a url form if no collection url or book url", () => {
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
      />
    );

    let urlForms = wrapper.find(UrlForm);
    expect(urlForms.length).to.equal(1);
  });

  it("doesn't show a url form if collection url", () => {
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        collectionUrl="test"
        setCollectionAndBook={mockSetCollectionAndBook}
      />
    );

    let urlForms = wrapper.find(UrlForm);
    expect(urlForms.length).to.equal(0);
  });

  it("doesn't show a url form if book url", () => {
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        bookUrl="test"
        setCollectionAndBook={mockSetCollectionAndBook}
      />
    );

    let urlForms = wrapper.find(UrlForm);
    expect(urlForms.length).to.equal(0);
  });

  it("fetches a collection url on mount", () => {
    let collectionUrl =
      "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let setCollectionAndBook = stub().returns(setCollectionAndBookPromise);
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        collectionUrl={collectionUrl}
        setCollectionAndBook={setCollectionAndBook}
      />
    );

    expect(setCollectionAndBook.callCount).to.equal(1);
    expect(setCollectionAndBook.args[0][0]).to.equal(collectionUrl);
    expect(setCollectionAndBook.args[0][1]).not.to.be.ok;
  });

  it("fetches a book url on mount", () => {
    let bookUrl = "http://example.com/book";
    let setCollectionAndBook = stub().returns(setCollectionAndBookPromise);
    let wrapper = shallow(
      <Root
        bookUrl={bookUrl}
        setCollectionAndBook={setCollectionAndBook}
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
      />
    );

    expect(setCollectionAndBook.callCount).to.equal(1);
    expect(setCollectionAndBook.args[0][0]).not.to.be.ok;
    expect(setCollectionAndBook.args[0][1]).to.equal(bookUrl);
  });

  it("fetches loans on mount", done => {
    let collectionUrl =
      "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let setCollectionAndBook = (collectionUrl, bookUrl) => {
      return new Promise((resolve, reject) =>
        resolve({
          collectionData: Object.assign({}, ungroupedCollectionData, {
            shelfUrl: "loans url"
          }),
          bookData: null
        })
      );
    };
    let fetchLoans = stub();
    let credentials = { provider: "test", credentials: "credentials" };
    let wrapper = shallow(
      <Root
        collectionUrl={collectionUrl}
        setCollectionAndBook={setCollectionAndBook}
        fetchLoans={fetchLoans}
        authCredentials={credentials}
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
      />
    );

    (wrapper.instance() as any)
      .componentWillMount()
      .then(() => {
        let count = fetchLoans.callCount;
        expect(fetchLoans.args[count - 1][0]).to.equal("loans url");
        done();
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });

  it("updates page title on mount", () => {
    let wrapper = shallow(
      <Root
        pageTitleTemplate={(collection, book) => "page title"}
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
      />
    );
    expect(document.title).to.equal("page title");
  });

  it("sets auth credentials on mount", () => {
    let credentials = { provider: "test", credentials: "credentials" };
    let saveAuthCredentials = stub();
    let wrapper = shallow(
      <Root
        saveAuthCredentials={saveAuthCredentials}
        authCredentials={credentials}
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
      />
    );
    expect(saveAuthCredentials.callCount).to.equal(1);
    expect(saveAuthCredentials.args[0][0]).to.equal(credentials);
  });

  const basicProps = {
    fulfillBook,
    indirectFulfillBook,
    updateBook,
    setPreference
  };

  it("checks for credentials on mount", () => {
    let credentials = { provider: "test", credentials: "credentials" };
    let plugin: AuthPlugin = {
      type: "test",
      lookForCredentials: stub().returns({ credentials }),
      formComponent: stub(),
      buttonComponent: stub()
    };
    let propsWithAuthPlugin = {
      authPlugins: [plugin],
      saveAuthCredentials: stub(),
      ...basicProps
    };

    let wrapper = shallow(<Root {...propsWithAuthPlugin} />);
    expect(
      (plugin.lookForCredentials as ReturnType<typeof stub>).callCount
    ).to.equal(1);
    expect(propsWithAuthPlugin.saveAuthCredentials.callCount).to.equal(1);
    expect(propsWithAuthPlugin.saveAuthCredentials.args[0][0]).to.deep.equal(
      credentials
    );
  });

  it("sets auth error in state on mount if lookForCredentials returns an error", () => {
    let plugin = {
      type: "test",
      lookForCredentials: stub().returns({ error: "error!" }),
      formComponent: stub(),
      buttonComponent: stub()
    };
    let propsWithAuthPlugin = {
      authPlugins: [plugin],
      ...basicProps
    };

    let wrapper = shallow(<Root {...propsWithAuthPlugin} />);
    expect(plugin.lookForCredentials.callCount).to.equal(1);
    expect(wrapper.state().authError).to.equal("error!");
  });

  it("shows error message if there's an auth error in the state", () => {
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
      />
    );
    wrapper.setState({ authError: "error!" });
    let error = wrapper.find(ErrorMessage);
    expect(error.length).to.equal(1);
    expect(error.props().message).to.equal("error!");

    error.props().close();
    expect(wrapper.state().authError).to.be.null;
  });

  it("fetches a collection url when updated", () => {
    let elem = document.createElement("div");
    let collectionUrl =
      "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let newCollection = "new collection url";
    let setCollectionAndBook = stub().returns(setCollectionAndBookPromise);
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        collectionUrl={collectionUrl}
        setCollectionAndBook={setCollectionAndBook}
      />
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
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        isFetchingCollection={true}
      />
    );

    let loadings = wrapper.find(LoadingIndicator);
    expect(loadings.length).to.equal(1);

    wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        isFetchingBook={true}
      />
    );
    loadings = wrapper.find(LoadingIndicator);
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
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        error={fetchError}
        retryCollectionAndBook={retry}
      />
    );

    let error = wrapper.find(ErrorMessage);
    expect(error.props().message).to.contain(fetchError.url);
    expect(error.props().message).to.contain(fetchError.response);
    expect(error.props().retry).to.equal(retry);
  });

  it("shows auth provider selection form", () => {
    let auth = {
      showForm: true,
      credentials: { provider: "test", credentials: "gibberish" },
      title: "Super Classified Archive",
      providers: [],
      error: "Invalid Clearance ID and/or Access Key",
      attemptedProvider: "Archive Login",
      callback: stub(),
      cancel: stub()
    };
    let saveAuthCredentials = stub();
    let closeErrorAndHideAuthForm = stub();
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        auth={auth}
        saveAuthCredentials={saveAuthCredentials}
        closeErrorAndHideAuthForm={closeErrorAndHideAuthForm}
      />
    );
    let form = wrapper.find(AuthProviderSelectionForm);
    let {
      saveCredentials,
      hide,
      callback,
      cancel,
      title,
      error,
      attemptedProvider,
      providers
    } = form.props();
    expect(saveCredentials).to.equal(saveAuthCredentials);
    expect(hide).to.equal(closeErrorAndHideAuthForm);
    expect(callback).to.equal(auth.callback);
    expect(cancel).to.equal(auth.cancel);
    expect(title).to.equal(auth.title);
    expect(providers).to.deep.equal(auth.providers);
    expect(error).to.equal(auth.error);
    expect(attemptedProvider).to.equal(auth.attemptedProvider);
  });

  it("shows book detail", () => {
    let bookData = groupedCollectionData.lanes[0].books[0];
    let loans = [
      Object.assign({}, bookData, {
        availability: { status: "available" }
      })
    ];
    let updateBook = stub();
    let fulfillBook = stub();
    let indirectFulfillBook = stub();
    let epubReaderUrlTemplate = stub();
    let wrapper = shallow(
      <Root
        bookData={bookData}
        loans={loans}
        updateBook={updateBook}
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        isSignedIn={true}
        epubReaderUrlTemplate={epubReaderUrlTemplate}
        setPreference={setPreference}
      />
    );

    let bookWrapper = wrapper.find(".book-details-wrapper");
    let book = wrapper.find(BookDetails);

    expect(bookWrapper.length).to.equal(1);
    expect(book.props().book).to.equal(loans[0]);
    expect(book.props().updateBook).to.equal(updateBook);
    expect(book.props().isSignedIn).to.equal(true);
    expect(book.props().epubReaderUrlTemplate).to.equal(epubReaderUrlTemplate);
  });

  it("shows breadcrumbs", () => {
    let history: LinkData[] = [
      {
        id: "2nd id",
        text: "2nd title",
        url: "2nd url"
      },
      {
        id: "last id",
        text: "last title",
        url: "last url"
      }
    ];

    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        collectionData={ungroupedCollectionData}
        history={history}
      />
    );

    let breadcrumbs = wrapper.find(Breadcrumbs);
    let links = history.concat([
      {
        url: ungroupedCollectionData.url,
        text: ungroupedCollectionData.title
      }
    ]);
    expect(breadcrumbs.props().links).to.deep.equal(links);
  });

  it("uses custom computeBreadcrumbs function", () => {
    let breadcrumb = {
      url: "breacrumb url",
      text: "breadcrumb text"
    };
    let computeBreadcrumbs = data => [breadcrumb];
    let wrapper = shallow(
      <Root
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
        collectionData={ungroupedCollectionData}
        computeBreadcrumbs={computeBreadcrumbs}
      />
    );
    let breadcrumbs = wrapper.find(Breadcrumbs);

    expect(breadcrumbs.props().links).to.deep.equal([breadcrumb]);
  });

  describe("provided a BookDetailsContainer", () => {
    class Container extends React.Component<BookDetailsContainerProps, {}> {
      render(): JSX.Element {
        return <div className="container">{this.props.children}</div>;
      }
    }

    it("renders BookDetailsContainer with urls, refresh, and book details", () => {
      let bookData = groupedCollectionData.lanes[0].books[0];
      let refresh = stub();
      let updateBook = stub();
      let fulfillBook = stub();
      let epubReaderUrlTemplate = stub();
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
          epubReaderUrlTemplate={epubReaderUrlTemplate}
          setPreference={setPreference}
          indirectFulfillBook={indirectFulfillBook}
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
      expect(child.props().epubReaderUrlTemplate).to.equal(
        epubReaderUrlTemplate
      );
    });

    it("does not render BookDetailsContainer if bookUrl and bookData.url are missing", () => {
      let bookData = Object.assign(
        {},
        groupedCollectionData.lanes[0].books[0],
        { url: null }
      );
      let refresh = stub();
      let wrapper = shallow(
        <Root
          bookData={bookData}
          bookUrl={undefined}
          collectionUrl="test collection"
          refreshCollectionAndBook={refresh}
          setCollectionAndBook={mockSetCollectionAndBook}
          BookDetailsContainer={Container}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          updateBook={updateBook}
          setPreference={setPreference}
        />
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
        pageTitleTemplate={pageTitleTemplate}
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        updateBook={updateBook}
        setPreference={setPreference}
      />
    );

    // template should be invoked by componentWillMount
    expect(pageTitleTemplate.callCount).to.equal(1);
    expect(pageTitleTemplate.args[0][0]).to.equal(collectionData.title);
    expect(pageTitleTemplate.args[0][1]).to.equal(bookData.title);
    expect(document.title).to.equal(
      "testing " + collectionData.title + ", " + bookData.title
    );

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

  describe("when given a header component", () => {
    let wrapper;
    let collectionData = Object.assign({}, ungroupedCollectionData, {
      search: {
        url: "test search url",
        searchData: {
          description: "description",
          shortName: "shortName",
          template: s => s
        }
      }
    });
    let bookData: BookData = ungroupedCollectionData.books[0];
    let fetchLoans;
    let clearAuthCredentials;

    class Header extends React.Component<HeaderProps, {}> {
      render(): JSX.Element {
        return (
          <div className="header">
            {this.props.children}
            <CatalogLink collectionUrl="test url">test</CatalogLink>
          </div>
        );
      }
    }

    beforeEach(() => {
      fetchLoans = stub();
      clearAuthCredentials = stub();
      wrapper = shallow(
        <Root
          Header={Header}
          collectionData={collectionData}
          bookData={bookData}
          fetchSearchDescription={(url: string) => {}}
          fetchLoans={fetchLoans}
          clearAuthCredentials={clearAuthCredentials}
          isSignedIn={true}
          loansUrl="loans"
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          updateBook={updateBook}
          setPreference={setPreference}
        />
      );
    });

    it("renders the header", () => {
      let header = wrapper.find(Header);
      let search = header.childAt(0);
      expect(header.props().collectionTitle).to.equal(collectionData.title);
      expect(header.props().bookTitle).to.equal(bookData.title);
      expect(header.props().isSignedIn).to.equal(true);
      expect(header.props().fetchLoans).to.equal(fetchLoans);
      expect(header.props().clearAuthCredentials).to.equal(
        clearAuthCredentials
      );
      expect(header.props().loansUrl).to.equal("loans");
      expect(search.type()).to.equal(Search);
    });
  });

  describe("when given a footer component", () => {
    let wrapper;
    let collectionData = ungroupedCollectionData;
    let bookData = ungroupedCollectionData.books[0];
    class Footer extends React.Component<FooterProps, {}> {
      render(): JSX.Element {
        return <div className="footer" />;
      }
    }

    beforeEach(() => {
      wrapper = shallow(
        <Root
          Footer={Footer}
          collectionData={collectionData}
          bookData={bookData}
          fetchSearchDescription={(url: string) => {}}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          updateBook={updateBook}
          setPreference={setPreference}
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
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          updateBook={updateBook}
          setPreference={setPreference}
        />,
        { context }
      ) as any;
      wrapper.instance().showNextBook();

      expect(mockPush.callCount).to.equal(1);
      expect(mockPush.args[0][0]).to.equal(
        context.pathFor(collectionData.url, nextBookData.url)
      );
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
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          updateBook={updateBook}
          setPreference={setPreference}
        />,
        { context }
      ) as any;
      wrapper.instance().showNextBook();

      expect(mockPush.callCount).to.equal(1);
      expect(mockPush.args[0][0]).to.equal(
        context.pathFor(collectionData.url, nextBookData.url)
      );
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
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          updateBook={updateBook}
          setPreference={setPreference}
        />,
        { context }
      ) as any;
      wrapper.instance().showPrevBook();

      expect(mockPush.callCount).to.equal(1);
      expect(mockPush.args[0][0]).to.equal(
        context.pathFor(collectionData.url, prevBookData.url)
      );
    });

    it("navigates to first book if currently showing second book", () => {
      bookData = groupedCollectionData.lanes[0].books[1];
      prevBookData = groupedCollectionData.lanes[0].books[0];
      wrapper = shallow(
        <Root
          collectionData={collectionData}
          bookData={bookData}
          setCollectionAndBook={mockSetCollectionAndBook}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          updateBook={updateBook}
          setPreference={setPreference}
        />,
        { context }
      ) as any;
      wrapper.instance().showPrevBook();

      expect(mockPush.callCount).to.equal(1);
      expect(mockPush.args[0][0]).to.equal(
        context.pathFor(collectionData.url, prevBookData.url)
      );
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
        router: PropTypes.object.isRequired,
        pathFor: PropTypes.func.isRequired
      };
      history = [
        {
          text: "root title",
          url: "root url"
        },
        {
          text: "some title",
          url: "some url"
        }
      ];

      wrapper = mount(
        <Root
          collectionData={collectionData}
          bookData={undefined}
          history={history}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          updateBook={updateBook}
          setPreference={setPreference}
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
      let bookLink = wrapper.find(".book a").first();
      let collectionUrl = collectionData.url;
      let bookUrl = collectionData.lanes[0].books[0].url;
      bookLink.simulate("click", { button: 0 });

      expect(push.callCount).to.equal(1);
      expect(push.args[0][0]).to.equal(context.pathFor(collectionUrl, bookUrl));
    });

    it("uses router to hide a book", () => {
      wrapper.setProps({ bookData });

      let collectionLink = wrapper
        .find("ol.breadcrumbs")
        .find(CatalogLink)
        .last();
      let collectionUrl = collectionData.url;
      collectionLink.simulate("click", { button: 0 });

      expect(push.callCount).to.equal(1);
      expect(push.args[0][0]).to.equal(context.pathFor(collectionUrl, null));
    });
  });

  describe("provided a CollectionContainer", () => {
    class Tabs extends React.Component<CollectionContainerProps, {}> {
      render(): JSX.Element {
        return <div className="tabs-container"></div>;
      }
    }

    describe("No CollectionContainer component rendering", () => {
      let history: LinkData[] = [
        {
          id: "2nd id",
          text: "2nd title",
          url: "2nd url"
        },
        {
          id: "last id",
          text: "last title",
          url: "last url"
        }
      ];

      it("should not render CollectionContainer if the component is not passed in", () => {
        let wrapper = shallow(
          <Root
            collectionData={ungroupedCollectionData}
            history={history}
            collectionUrl="/test"
            setCollectionAndBook={mockSetCollectionAndBook}
            fulfillBook={fulfillBook}
            indirectFulfillBook={indirectFulfillBook}
            updateBook={updateBook}
            setPreference={setPreference}
          />
        );

        let container = wrapper.find(Tabs);
        expect(container.length).to.equal(0);
      });

      it("should not render CollectionContainer if there is no collection data", () => {
        let wrapper = shallow(
          <Root
            history={history}
            collectionUrl="/test"
            setCollectionAndBook={mockSetCollectionAndBook}
            fulfillBook={fulfillBook}
            indirectFulfillBook={indirectFulfillBook}
            updateBook={updateBook}
            setPreference={setPreference}
          />
        );

        let container = wrapper.find(Tabs);
        expect(container.length).to.equal(0);
      });

      it("should not render CollectionContainer if the component is passed, but a book is being displayed", () => {
        let bookData = groupedCollectionData.lanes[0].books[0];
        let wrapper = shallow(
          <Root
            bookData={bookData}
            CollectionContainer={Tabs}
            collectionData={ungroupedCollectionData}
            history={history}
            collectionUrl="/test"
            setCollectionAndBook={mockSetCollectionAndBook}
            fulfillBook={fulfillBook}
            indirectFulfillBook={indirectFulfillBook}
            updateBook={updateBook}
            setPreference={setPreference}
          />
        );

        let container = wrapper.find(Tabs);
        expect(container.length).to.equal(0);
      });
    });

    it("renders CollectionContainer", () => {
      let history: LinkData[] = [
        {
          id: "2nd id",
          text: "2nd title",
          url: "2nd url"
        },
        {
          id: "last id",
          text: "last title",
          url: "last url"
        }
      ];
      let facetGroups = [
        {
          facets: [
            {
              label: "eBooks",
              href:
                "http://circulation.librarysimplified.org/groups/?entrypoint=Book",
              active: false
            },
            {
              label: "Audiobooks",
              href:
                "http://circulation.librarysimplified.org/groups/?entrypoint=Audio",
              active: false
            }
          ],
          label: "Formats"
        }
      ];
      ungroupedCollectionData.facetGroups = facetGroups;

      let wrapper = shallow(
        <Root
          collectionData={ungroupedCollectionData}
          history={history}
          collectionUrl="/test"
          setCollectionAndBook={mockSetCollectionAndBook}
          CollectionContainer={Tabs}
          fulfillBook={fulfillBook}
          indirectFulfillBook={indirectFulfillBook}
          updateBook={updateBook}
          setPreference={setPreference}
        />
      );

      let container = wrapper.find(Tabs);
      expect(container.length).to.equal(1);
    });
  });
});
