jest.dontMock("../mergeRootProps");
jest.dontMock("./collectionData");

import mergeRootProps, { findBookInCollection } from "../mergeRootProps";
import { groupedCollectionData, ungroupedCollectionData } from "./collectionData";

describe("mergeRootProps", () => {
  let stateProps, dispatchProps, componentProps;
  let fetchCollection, clearCollection, fetchBook, loadBook, clearBook, onNavigate;
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
    onNavigate = jest.genMockFunction();
    dispatchProps = { fetchCollection, clearCollection, loadBook, fetchBook, clearBook };
    componentProps = { onNavigate };
  });

  describe("setCollection", () => {
    let props;

    beforeEach(() => {
      stateProps = {
        collectionUrl: "test url",
        collectionData: groupedCollectionData,
        bookUrl: null,
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
        expect(onNavigate.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls[0][0]).toBe("new collection url");
        expect(onNavigate.mock.calls[0][1]).toBe(stateProps.bookUrl);
        done();
      });
    });

    it("does nothing and returns existing data if given the existing collection url", (done) => {
      props.setCollection("test url").then(data => {
        expect(data).toBe(groupedCollectionData);
        expect(fetchCollection.mock.calls.length).toBe(0);
        expect(clearCollection.mock.calls.length).toBe(0);
        expect(onNavigate.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls[0][0]).toBe(stateProps.collectionUrl);
        expect(onNavigate.mock.calls[0][1]).toBe(stateProps.bookUrl);
        done();
      });
    });

    it("clears collection data if given a falsy collection url", (done) => {
      props.setCollection(null).then(data => {
        expect(data).toBeFalsy;
        expect(fetchCollection.mock.calls.length).toBe(0);
        expect(clearCollection.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls[0][0]).toBe(null);
        expect(onNavigate.mock.calls[0][1]).toBe(stateProps.bookUrl);
        done();
      });
    });

    it("does not call onNavigate if given skipOnNavigate = true", (done) => {
      props.setCollection("test url", true).then(data => {
        expect(onNavigate.mock.calls.length).toBe(0);
        done();
      });
    });
  });

  describe("setBook", () => {
    let props;

    beforeEach(() => {
      stateProps = {
        collectionUrl: "test collection url",
        collectionData: groupedCollectionData,
        bookUrl: "test book url",
        bookData: {
          id: "test book id",
          title: "test book title",
          url: "test book url"
        }
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);
    });

    it("fetches book data if given a book url", (done) => {
      props.setBook("fake book url").then(data => {
        expect(data).toBe(fakeBook);
        expect(fetchBook.mock.calls.length).toBe(1);
        expect(fetchBook.mock.calls[0][0]).toBe("fake book url");
        expect(clearBook.mock.calls.length).toBe(0);
        expect(onNavigate.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls[0][0]).toBe(stateProps.collectionUrl);
        expect(onNavigate.mock.calls[0][1]).toBe("fake book url");
        done();
      });
    });

    it("does nothing and returns existing data if given the existing book url", (done) => {
      props.setBook("test book url").then(data => {
        expect(data).toBe(stateProps.bookData);
        expect(fetchBook.mock.calls.length).toBe(0);
        expect(clearBook.mock.calls.length).toBe(0);
        expect(onNavigate.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls[0][0]).toBe(stateProps.collectionUrl);
        expect(onNavigate.mock.calls[0][1]).toBe(stateProps.bookUrl);
        done();
      });
    });

    it("clears book data if given a falsy book url", (done) => {
      props.setBook(null).then(data => {
        expect(data).toBeFalsy;
        expect(fetchBook.mock.calls.length).toBe(0);
        expect(clearBook.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls[0][0]).toBe(stateProps.collectionUrl);
        expect(onNavigate.mock.calls[0][1]).toBe(null);
        done();
      });
    });

    it("does not call onNavigate if given skipOnNavigate = true", (done) => {
      props.setBook("test url", true).then(data => {
        expect(onNavigate.mock.calls.length).toBe(0);
        done();
      });
    });
  });

  describe("setCollectionAndBook", () => {
    let props;

    beforeEach(() => {
      stateProps = {
        collectionUrl: "test collection url",
        collectionData: groupedCollectionData,
        bookUrl: "test book url",
        bookData: {
          id: "test book id",
          title: "test book title",
          url: "test book url"
        }
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
        expect(onNavigate.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls[0][0]).toBe(fakeCollection.url);
        expect(onNavigate.mock.calls[0][1]).toBe(fakeCollection.books[0].url);
        done();
      });
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
        expect(onNavigate.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls[0][0]).toBe(fakeCollection.url);
        expect(onNavigate.mock.calls[0][1]).toBe("fake book url");
        done();
      });
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
        expect(onNavigate.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls[0][0]).toBe(null);
        expect(onNavigate.mock.calls[0][1]).toBe("fake book url");
        done();
      });
    });

    it("does nothing and returns existing data if given the existing collection and book urls", (done) => {
      props.setCollectionAndBook("test collection url", "test book url").then(data => {
        expect(data).toEqual({
          collectionData: stateProps.collectionData,
          bookData: stateProps.bookData
        });
        expect(fetchCollection.mock.calls.length).toBe(0);
        expect(fetchBook.mock.calls.length).toBe(0);
        expect(clearCollection.mock.calls.length).toBe(0);
        expect(clearBook.mock.calls.length).toBe(0);
        expect(onNavigate.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls[0][0]).toBe("test collection url");
        expect(onNavigate.mock.calls[0][1]).toBe("test book url");
        done();
      });
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
        expect(onNavigate.mock.calls.length).toBe(1);
        expect(onNavigate.mock.calls[0][0]).toBe(null);
        expect(onNavigate.mock.calls[0][1]).toBe(null);
        done();
      });
    });

    it("does not call onNavigate if given skipOnNavigate = true", (done) => {
      props.setCollectionAndBook("new collection url", "new book url", true).then(data => {
        expect(onNavigate.mock.calls.length).toBe(0);
        done();
      });
    });
  });
});