jest.dontMock("../mergeRootProps");
jest.dontMock("./collectionData");
jest.dontMock("../../actions");

import { mergeRootProps, findBookInCollection } from "../mergeRootProps";
import { groupedCollectionData, ungroupedCollectionData } from "./collectionData";

describe("findBookInCollection", () => {
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
        currentCollectionUrl: "test url",
        collectionData: groupedCollectionData,
        currentBookUrl: null,
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
      props.setBook("fake book url").then(data => {
        expect(data).toBe(fakeBook);
        expect(fetchBook.mock.calls.length).toBe(1);
        expect(fetchBook.mock.calls[0][0]).toBe("fake book url");
        expect(clearBook.mock.calls.length).toBe(0);
        done();
      }).catch(err => done.fail(err));
    });

    it("doesn't fetch book data if given a book url in the current collection", (done) => {
      props.setBook(groupedCollectionData.lanes[0].books[0].url).then(data => {
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

    it("tries to refresh book data if given the existing book url", (done) => {
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
});