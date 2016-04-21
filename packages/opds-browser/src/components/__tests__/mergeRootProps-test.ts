jest.dontMock("../mergeRootProps");
jest.dontMock("./collectionData");
jest.dontMock("../../actions");

import { mergeRootProps, findBookInCollection } from "../mergeRootProps";
import { groupedCollectionData, ungroupedCollectionData } from "./collectionData";

describe("findBookInCollection", () => {
  it("returns nothing if no collection", () => {
    let result = findBookInCollection(null, "test");
    expect(result).toBe(null);
  });

  it("finds a book in the collection by url", () => {
    let collection = groupedCollectionData;
    let book = groupedCollectionData.lanes[0].books[0];
    let result = findBookInCollection(collection, book.url);
    expect(result).toEqual(book);
  });

  it("finds a book in the collection by id", () => {
    let collection = groupedCollectionData;
    let book = groupedCollectionData.lanes[0].books[0];
    let result = findBookInCollection(collection, book.id);
    expect(result).toEqual(book);
  });

  it("returns nothing if given a book url/id not in the collection", () => {
    let collection = groupedCollectionData;
    let result = findBookInCollection(collection, "nonexistent");
    expect(result).toBeFalsy();
  });
});

describe("mergeRootProps", () => {
  let stateProps, dispatchProps, componentProps;
  let fetchCollection, clearCollection, fetchBook, loadBook, clearBook, navigate;
  let fakeCollection = ungroupedCollectionData;
  let fakeBook = {
    id: "fake book id",
    title: "fake book title",
    url: "fake book url"
  };

  beforeEach(() => {
    fetchCollection = jest.genMockFunction().mockImplementation((url) => {
      return new Promise((resolve, reject) => {
        resolve(fakeCollection);
      });
    });
    fetchBook = jest.genMockFunction().mockImplementation((url) => {
      return new Promise((resolve, reject) => {
        resolve(fakeBook);
      });
    });
    loadBook = jest.genMockFunction();
    clearCollection = jest.genMockFunction();
    clearBook = jest.genMockFunction();
    dispatchProps = { createDispatchProps: (fetcher) => {
      return { fetchCollection, clearCollection, loadBook, fetchBook, clearBook };
    }};
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

    it("fetches collection data if given a collection url", (done) => {
      props.setCollection("new collection url").then(data => {
        expect(data).toBe(fakeCollection);
        expect(fetchCollection.mock.calls.length).toBe(1);
        expect(fetchCollection.mock.calls[0][0]).toBe("new collection url");
        expect(clearCollection.mock.calls.length).toBe(0);
        done();
      }).catch(err => done.fail(err));
    });

    it("does nothing and returns existing data if given the existing collection url", (done) => {
      props.setCollection("test url").then(data => {
        expect(data).toBe(groupedCollectionData);
        expect(fetchCollection.mock.calls.length).toBe(0);
        expect(clearCollection.mock.calls.length).toBe(0);
        done();
      }).catch(err => done.fail(err));
    });

    it("clears collection data if given a falsy collection url", (done) => {
      props.setCollection(null).then(data => {
        expect(data).toBeFalsy();
        expect(fetchCollection.mock.calls.length).toBe(0);
        expect(clearCollection.mock.calls.length).toBe(1);
        done();
      }).catch(err => done.fail(err));
    });

    it("passes isTopLevel to fetchCollection", (done) => {
      props.setCollection("new collection url", true).then(data => {
        expect(fetchCollection.mock.calls[0][1]).toBe(true);
        done();
      }).catch(err => done.fail(err));
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

    it("fetches book data if given a book url not in the current collection", (done) => {
      props.setBook("fake book url", groupedCollectionData).then(data => {
        expect(data).toBe(fakeBook);
        expect(fetchBook.mock.calls.length).toBe(1);
        expect(fetchBook.mock.calls[0][0]).toBe("fake book url");
        expect(clearBook.mock.calls.length).toBe(0);
        done();
      }).catch(err => done.fail(err));
    });

    it("doesn't fetch book data if given a book url in the current collection", (done) => {
      props.setBook(groupedCollectionData.lanes[0].books[0].url, groupedCollectionData).then(data => {
        expect(data).toBe(groupedCollectionData.lanes[0].books[0]);
        expect(fetchBook.mock.calls.length).toBe(0);
        expect(clearBook.mock.calls.length).toBe(0);
        done();
      }).catch(err => done.fail(err));
    });

    it("does nothing and returns book data if given book data", (done) => {
      let bookDataWithoutUrl = {
        id: "test id",
        "title": "test title"
      };
      props.setBook(bookDataWithoutUrl).then(data => {
        expect(data).toBe(bookDataWithoutUrl);
        expect(fetchBook.mock.calls.length).toBe(0);
        expect(clearBook.mock.calls.length).toBe(0);
        done();
      }).catch(err => done.fail(err));
    });

    it("tries to refresh book data if given the existing book url and no collection", (done) => {
      props.setBook("test book url").then(data => {
        expect(data).toBe(fakeBook);
        expect(fetchBook.mock.calls.length).toBe(1);
        expect(clearBook.mock.calls.length).toBe(0);
        done();
      }).catch(err => done.fail(err));
    });

    it("clears book data if given a falsy book url", (done) => {
      props.setBook(null).then(data => {
        expect(data).toBeFalsy();
        expect(fetchBook.mock.calls.length).toBe(0);
        expect(clearBook.mock.calls.length).toBe(1);
        done();
      }).catch(err => done.fail(err));
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

    it("does not fetch book if given book url belonging to given collection", (done) => {
      props.setCollectionAndBook(fakeCollection.url, fakeCollection.books[0].url).then(data => {
        expect(data).toEqual({
          collectionData: fakeCollection,
          bookData: fakeCollection.books[0]
        });
        expect(fetchCollection.mock.calls.length).toBe(1);
        expect(fetchCollection.mock.calls[0][0]).toBe(fakeCollection.url);
        expect(fetchBook.mock.calls.length).toBe(0);
        done();
      }).catch(err => done.fail(err));
    });

    it("fetches book if given book url not belonging to given collection", (done) => {
      props.setCollectionAndBook(fakeCollection.url, "fake book url").then(data => {
        expect(data).toEqual({
          collectionData: fakeCollection,
          bookData: fakeBook
        });
        expect(fetchCollection.mock.calls.length).toBe(1);
        expect(fetchCollection.mock.calls[0][0]).toBe(fakeCollection.url);
        expect(fetchBook.mock.calls.length).toBe(1);
        expect(fetchBook.mock.calls[0][0]).toBe("fake book url");
        done();
      }).catch(err => done.fail(err));
    });

    it("fetches book if not given a collection url", (done) => {
      props.setCollectionAndBook(null, "fake book url").then(data => {
        expect(data).toEqual({
          collectionData: null,
          bookData: fakeBook
        });
        expect(fetchCollection.mock.calls.length).toBe(0);
        expect(fetchBook.mock.calls.length).toBe(1);
        expect(fetchBook.mock.calls[0][0]).toBe("fake book url");
        done();
      }).catch(err => done.fail(err));
    });

    it("does nothing and returns existing data if given the existing collection and book urls", (done) => {
      props.setCollectionAndBook(stateProps.loadedCollectionUrl, stateProps.bookData.url).then(data => {
        expect(data).toEqual({
          collectionData: stateProps.collectionData,
          bookData: stateProps.bookData
        });
        expect(fetchCollection.mock.calls.length).toBe(0);
        expect(fetchBook.mock.calls.length).toBe(0);
        expect(clearCollection.mock.calls.length).toBe(0);
        expect(clearBook.mock.calls.length).toBe(0);
        done();
      }).catch(err => done.fail(err));
    });

    it("clears collection and book data if given falsy urls", (done) => {
      props.setCollectionAndBook(null, null).then(data => {
        expect(data).toEqual({
          collectionData: null,
          bookData: null
        });
        expect(fetchCollection.mock.calls.length).toBe(0);
        expect(fetchBook.mock.calls.length).toBe(0);
        expect(clearCollection.mock.calls.length).toBe(1);
        expect(clearBook.mock.calls.length).toBe(1);
        done();
      }).catch(err => done.fail(err));
    });

    it("passes isTopLevel to fetchCollection", (done) => {
      props.setCollectionAndBook("new collection url", null, true).then(data => {
        expect(fetchCollection.mock.calls[0][1]).toBe(true);
        done();
      }).catch(err => done.fail(err));
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

      expect(fetchCollection.mock.calls.length).toBe(1);
      expect(fetchCollection.mock.calls[0][0]).toBe("test collection");
    });

    it("calls fetchBook", (done) => {
      stateProps = {
        loadedCollectionUrl: "test collection",
        loadedBookUrl: "test book"
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props.refreshCollectionAndBook().then(data => {
        expect(fetchBook.mock.calls.length).toBe(1);
        expect(fetchBook.mock.calls[0][0]).toBe("test book");
        done();
      });
    });

    it("only fetches collection if only collection is loaded", () => {
      stateProps = {
        loadedCollectionUrl: "test collection",
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);
      props.refreshCollectionAndBook();

      expect(fetchCollection.mock.calls.length).toBe(1);
      expect(fetchCollection.mock.calls[0][0]).toBe("test collection");
      expect(fetchBook.mock.calls.length).toBe(0);
    });

    it("only fetches book if only book is loaded", (done) => {
      stateProps = {
        loadedCollectionUrl: null,
        loadedBookUrl: "test book"
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props.refreshCollectionAndBook().then(data => {
        expect(fetchBook.mock.calls.length).toBe(1);
        expect(fetchBook.mock.calls[0][0]).toBe("test book");
        expect(fetchCollection.mock.calls.length).toBe(0);
        done();
      });
    });

    it("does not fetch if neither collection nor book are loaded", (done) => {
      stateProps = {
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props.refreshCollectionAndBook().then(data => {
        expect(fetchCollection.mock.calls.length).toBe(0);
        expect(fetchBook.mock.calls.length).toBe(0);
        done();
      });
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

      expect(fetchCollection.mock.calls.length).toBe(1);
      expect(fetchCollection.mock.calls[0][0]).toBe("test collection");
    });

    it("calls fetchBook", (done) => {
      stateProps = {
        collectionUrl: "test collection",
        bookUrl: "test book",
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props.retryCollectionAndBook().then(data => {
        expect(fetchBook.mock.calls.length).toBe(1);
        expect(fetchBook.mock.calls[0][0]).toBe("test book");
        done();
      });
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

      expect(fetchCollection.mock.calls.length).toBe(1);
      expect(fetchCollection.mock.calls[0][0]).toBe("test collection");
      expect(fetchBook.mock.calls.length).toBe(0);
    });

    it("only fetches book if only book is loaded", (done) => {
      stateProps = {
        collectionUrl: null,
        bookUrl: "test book",
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props.retryCollectionAndBook().then(data => {
        expect(fetchBook.mock.calls.length).toBe(1);
        expect(fetchBook.mock.calls[0][0]).toBe("test book");
        expect(fetchCollection.mock.calls.length).toBe(0);
        done();
      });
    });

    it("does not fetch if neither collection nor book are loaded", (done) => {
      stateProps = {
        collectionUrl: null,
        bookUrl: null,
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props.retryCollectionAndBook().then(data => {
        expect(fetchCollection.mock.calls.length).toBe(0);
        expect(fetchBook.mock.calls.length).toBe(0);
        done();
      });
    });
  });
});