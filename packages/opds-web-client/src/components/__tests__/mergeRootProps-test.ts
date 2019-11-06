import { expect } from "chai";
import { stub, spy } from "sinon";

import ActionCreator from "../../actions";

// synchronous actions for simple testing
// of createFetchCollectionAndBook
let fetchCollectionStub = stub().returns(Promise.resolve({}));
let fetchBookStub = stub().returns(Promise.resolve({}));

import { mergeRootProps, findBookInCollection, createFetchCollectionAndBook } from "../mergeRootProps";
import { groupedCollectionData, ungroupedCollectionData } from "./collectionData";

describe("findBookInCollection", () => {
  it("returns nothing if no collection", () => {
    let result = findBookInCollection(null, "test");
    expect(result).to.equal(null);
  });

  it("finds a book in the collection by url", () => {
    let collection = groupedCollectionData;
    let book = groupedCollectionData.lanes[0].books[0];
    let result = findBookInCollection(collection, book.url);
    expect(result).to.equal(book);
  });

  it("finds a book in the collection by id", () => {
    let collection = groupedCollectionData;
    let book = groupedCollectionData.lanes[0].books[0];
    let result = findBookInCollection(collection, book.id);
    expect(result).to.equal(book);
  });

  it("returns nothing if given a book url/id not in the collection", () => {
    let collection = groupedCollectionData;
    let result = findBookInCollection(collection, "nonexistent");
    expect(result).not.to.be.ok;
  });
});

describe("createFetchCollectionAndBook", () => {
  let collectionUrl = "collection url";
  let bookUrl = "book url";
  let dispatch = stub().returns(new Promise((resolve, reject) => resolve()));
  let actionFetchCollectionStub;
  let actionBookCollectionStub;

  beforeEach(() => {
    actionFetchCollectionStub =
      stub(ActionCreator.prototype, "fetchCollection").callsFake(() => fetchCollectionStub);
    actionBookCollectionStub =
      stub(ActionCreator.prototype, "fetchBook").callsFake(() => fetchBookStub);
  });

  afterEach(() => {
    actionFetchCollectionStub.restore();
    actionBookCollectionStub.restore();
  });

  it("returns fetch function that uses the provided dispatch", async () => {
    let fetchCollectionAndBook = createFetchCollectionAndBook(dispatch);
    fetchCollectionAndBook(collectionUrl, bookUrl)
      .then(({ collectionData, bookData }) => {
        // we are only testing that the provided dispatch is called twice,
        // once for fetchCollection and once for fetchBook
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0]).to.equal(fetchCollectionStub);
        expect(dispatch.args[1][0]).to.equal(fetchBookStub);
      })
      .catch(err => { console.log(err); throw(err); });
  });
});

describe("mergeRootProps", () => {
  let stateProps, dispatchProps, componentProps;
  let fetchCollection, clearCollection, fetchBook, loadBook, clearBook,
    navigate, updateBook, fetchLoans, loadCollection;
  let fakeCollection = ungroupedCollectionData;
  let fakeBook = {
    id: "fake book id",
    title: "fake book title",
    url: "fake book url"
  };

  beforeEach(() => {
    fetchCollection = spy(url => Promise.resolve(fakeCollection));
    fetchBook = spy(url => Promise.resolve(fakeBook));
    loadCollection = spy(data => Promise.resolve(data));
    loadBook = stub();
    clearCollection = stub();
    clearBook = stub();
    updateBook = spy(url => Promise.resolve(fakeBook));
    fetchLoans = stub();
    dispatchProps = {
      createDispatchProps: (fetcher) => ({
        fetchCollection, clearCollection, loadBook, fetchBook, clearBook,
        updateBook, fetchLoans, loadCollection
      })
    };
    componentProps = {};
  });

  describe("setCollection", () => {
    let props;

    beforeEach(() => {
      stateProps = {
        loadedCollectionUrl: "test url",
        collectionData: groupedCollectionData,
        bookData: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);
    });

    it("fetches collection data if given a collection url", async () => {
      await props.setCollection("new collection url").then(data => {
        expect(data).to.equal(fakeCollection);
        expect(fetchCollection.callCount).to.equal(1);
        expect(fetchCollection.args[0][0]).to.equal("new collection url");
        expect(clearCollection.callCount).to.equal(0);
     }).catch(err => { console.log(err); throw(err); });
    });

    it("does nothing and returns existing data if given the existing collection url", async () => {
      await props.setCollection("test url").then(data => {
        expect(data).to.equal(groupedCollectionData);
        expect(fetchCollection.callCount).to.equal(0);
        expect(clearCollection.callCount).to.equal(0);
      }).catch(err => { console.log(err); throw(err); });
    });

    it("loads a loans collection data if it was already loaded into the state", async () => {
      // Mock that a loans collection was already loaded into the state.
      stateProps = {
        loadedCollectionUrl: "test url",
        collectionData: ungroupedCollectionData,
        loansData: groupedCollectionData,
        bookData: null,
        loansUrl: "loans url",
        loans: ["book1", "book2"]
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      await props.setCollection("loans url").then(data => {
        expect(data).to.equal(groupedCollectionData);
        expect(fetchCollection.callCount).to.equal(0);
        expect(clearCollection.callCount).to.equal(1);
        expect(loadCollection.callCount).to.equal(1);
      }).catch(err => { console.log(err); throw(err); });
    });

    it("clears collection data if given a falsy collection url", async () => {
      await props.setCollection(null).then(data => {
        expect(data).not.to.be.ok;
        expect(fetchCollection.callCount).to.equal(0);
        expect(clearCollection.callCount).to.equal(1);
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("setBook", () => {
    let props;

    beforeEach(() => {
      stateProps = {
        currentCollectionUrl: "test collection url",
        collectionData: groupedCollectionData,
        currentBookUrl: "test book url",
        bookData: {
          id: "test book id",
          title: "test book title",
          url: "test book url"
        }
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);
    });

    it("fetches book data if given a book url not in the current collection", async () => {
      await props.setBook("fake book url", groupedCollectionData).then(data => {
        expect(data).to.equal(fakeBook);
        expect(fetchBook.callCount).to.equal(1);
        expect(fetchBook.args[0][0]).to.equal("fake book url");
        expect(clearBook.callCount).to.equal(0);
      }).catch(err => { console.log(err); throw(err); });
    });

    it("doesn't fetch book data if given a book url in the current collection", async () => {
      await props.setBook(groupedCollectionData.lanes[0].books[0].url, groupedCollectionData).then(data => {
        expect(data).to.equal(groupedCollectionData.lanes[0].books[0]);
        expect(fetchBook.callCount).to.equal(0);
        expect(clearBook.callCount).to.equal(0);
      }).catch(err => { console.log(err); throw(err); });
    });

    it("does nothing and returns book data if given book data", async () => {
      let bookDataWithoutUrl = {
        id: "test id",
        "title": "test title"
      };
      await props.setBook(bookDataWithoutUrl).then(data => {
        expect(data).to.equal(bookDataWithoutUrl);
        expect(fetchBook.callCount).to.equal(0);
        expect(clearBook.callCount).to.equal(0);
      }).catch(err => { console.log(err); throw(err); });
    });

    it("tries to refresh book data if given the existing book url and no collection", async () => {
      await props.setBook("test book url").then(data => {
        expect(data).to.equal(fakeBook);
        expect(fetchBook.callCount).to.equal(1);
        expect(clearBook.callCount).to.equal(0);
      }).catch(err => { console.log(err); throw(err); });
    });

    it("clears book data if given a falsy book url", async () => {
      await props.setBook(null).then(data => {
        expect(data).not.to.be.ok;
        expect(fetchBook.callCount).to.equal(0);
        expect(clearBook.callCount).to.equal(1);
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("setCollectionAndBook", () => {
    let props;

    beforeEach(() => {
      stateProps = {
        loadedCollectionUrl: groupedCollectionData.url,
        collectionData: groupedCollectionData,
        bookData: groupedCollectionData.lanes[0].books[0]
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);
    });

    it("does not fetch book if given book url belonging to given collection", async () => {
      await props.setCollectionAndBook(fakeCollection.url, fakeCollection.books[0].url).then(data => {
        expect(data).to.deep.equal({
          collectionData: fakeCollection,
          bookData: fakeCollection.books[0]
        });
        expect(fetchCollection.callCount).to.equal(1);
        expect(fetchCollection.args[0][0]).to.equal(fakeCollection.url);
        expect(fetchBook.callCount).to.equal(0);
      }).catch(err => { console.log(err); throw(err); });
    });

    it("fetches book if given book url not belonging to given collection", async () => {
      await props.setCollectionAndBook(fakeCollection.url, "fake book url").then(data => {
        expect(data).to.deep.equal({
          collectionData: fakeCollection,
          bookData: fakeBook
        });
        expect(fetchCollection.callCount).to.equal(1);
        expect(fetchCollection.args[0][0]).to.equal(fakeCollection.url);
        expect(fetchBook.callCount).to.equal(1);
        expect(fetchBook.args[0][0]).to.equal("fake book url");
      }).catch(err => { console.log(err); throw(err); });
    });

    it("fetches book if not given a collection url", async () => {
      await props.setCollectionAndBook(null, "fake book url").then(data => {
        expect(data).to.deep.equal({
          collectionData: null,
          bookData: fakeBook
        });
        expect(fetchCollection.callCount).to.equal(0);
        expect(fetchBook.callCount).to.equal(1);
        expect(fetchBook.args[0][0]).to.equal("fake book url");
      }).catch(err => { console.log(err); throw(err); });
    });

    it("does nothing and returns existing data if given the existing collection and book urls", async () => {
      await props.setCollectionAndBook(stateProps.loadedCollectionUrl, stateProps.bookData.url).then(data => {
        expect(data).to.deep.equal({
          collectionData: stateProps.collectionData,
          bookData: stateProps.bookData
        });
        expect(fetchCollection.callCount).to.equal(0);
        expect(fetchBook.callCount).to.equal(0);
        expect(clearCollection.callCount).to.equal(0);
        expect(clearBook.callCount).to.equal(0);
      }).catch(err => { console.log(err); throw(err); });
    });

    it("clears collection and book data if given falsy urls", async () => {
      await props.setCollectionAndBook(null, null).then(data => {
        expect(data).to.deep.equal({
          collectionData: null,
          bookData: null
        });
        expect(fetchCollection.callCount).to.equal(0);
        expect(fetchBook.callCount).to.equal(0);
        expect(clearCollection.callCount).to.equal(1);
        expect(clearBook.callCount).to.equal(1);
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("refreshCollectionAndBook", () => {
    let props;

    it("calls fetchCollection", () => {
      stateProps = {
        loadedCollectionUrl: "test collection",
        loadedBookUrl: "test book"
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);
      props.refreshCollectionAndBook();

      expect(fetchCollection.callCount).to.equal(1);
      expect(fetchCollection.args[0][0]).to.equal("test collection");
    });

    it("calls fetchBook", async () => {
      stateProps = {
        loadedCollectionUrl: "test collection",
        loadedBookUrl: "test book"
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      await props.refreshCollectionAndBook().then(data => {
        expect(fetchBook.callCount).to.equal(1);
        expect(fetchBook.args[0][0]).to.equal("test book");
      }).catch(err => { console.log(err); throw(err); });
    });

    it("only fetches collection if only collection is loaded", () => {
      stateProps = {
        loadedCollectionUrl: "test collection",
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);
      props.refreshCollectionAndBook();

      expect(fetchCollection.callCount).to.equal(1);
      expect(fetchCollection.args[0][0]).to.equal("test collection");
      expect(fetchBook.callCount).to.equal(0);
    });

    it("only fetches book if only book is loaded", async () => {
      stateProps = {
        loadedCollectionUrl: null,
        loadedBookUrl: "test book"
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      await props.refreshCollectionAndBook().then(data => {
        expect(fetchBook.callCount).to.equal(1);
        expect(fetchBook.args[0][0]).to.equal("test book");
        expect(fetchCollection.callCount).to.equal(0);
      }).catch(err => { console.log(err); throw(err); });
    });

    it("does not fetch if neither collection nor book are loaded", async () => {
      stateProps = {
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      await props.refreshCollectionAndBook().then(data => {
        expect(fetchCollection.callCount).to.equal(0);
        expect(fetchBook.callCount).to.equal(0);
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("retryCollectionAndBook", () => {
    let props;

    it("calls fetchCollection", () => {
      stateProps = {
        collectionUrl: "test collection",
        bookUrl: "test book",
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);
      props.retryCollectionAndBook();

      expect(fetchCollection.callCount).to.equal(1);
      expect(fetchCollection.args[0][0]).to.equal("test collection");
    });

    it("calls fetchBook", async () => {
      stateProps = {
        collectionUrl: "test collection",
        bookUrl: "test book",
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      await props.retryCollectionAndBook().then(data => {
        expect(fetchBook.callCount).to.equal(1);
        expect(fetchBook.args[0][0]).to.equal("test book");
      }).catch(err => { console.log(err); throw(err); });
    });

    it("only fetches collection if only collectionUrl is present", () => {
      stateProps = {
        collectionUrl: "test collection",
        bookUrl: null,
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);
      props.retryCollectionAndBook();

      expect(fetchCollection.callCount).to.equal(1);
      expect(fetchCollection.args[0][0]).to.equal("test collection");
      expect(fetchBook.callCount).to.equal(0);
    });

    it("only fetches book if only book is loaded", async () => {
      stateProps = {
        collectionUrl: null,
        bookUrl: "test book",
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      await props.retryCollectionAndBook().then(data => {
        expect(fetchBook.callCount).to.equal(1);
        expect(fetchBook.args[0][0]).to.equal("test book");
        expect(fetchCollection.callCount).to.equal(0);
      }).catch(err => { console.log(err); throw(err); });
    });

    it("does not fetch if neither collection nor book are loaded", async () => {
      stateProps = {
        collectionUrl: null,
        bookUrl: null,
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      await props.retryCollectionAndBook().then(data => {
        expect(fetchCollection.callCount).to.equal(0);
        expect(fetchBook.callCount).to.equal(0);
      }).catch(err => { console.log(err); throw(err); });
    });
  });

  describe("updateBook", () => {
    let props;

    it("calls updateBook", () => {
      stateProps = {
        loansUrl: "loans"
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);
      props.updateBook("borrow url");

      expect(updateBook.callCount).to.equal(1);
      expect(updateBook.args[0][0]).to.equal("borrow url");
    });

    it("calls fetchLoans if loansUrl is present", async () => {
      stateProps = {
        loansUrl: "loans"
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      await props.updateBook().then(data => {
        expect(fetchLoans.callCount).to.equal(1);
        expect(fetchLoans.args[0][0]).to.equal("loans");
        expect(data).to.equal(fakeBook);
      }).catch(err => { console.log(err); throw(err); });
    });

    it("doesn't call fetchLoans if loansUrl is blank", async () => {
      props = mergeRootProps({}, dispatchProps, componentProps);

      await props.updateBook().then(data => {
        expect(fetchLoans.callCount).to.equal(0);
      }).catch(err => { console.log(err); throw(err); });
    });
  });
});