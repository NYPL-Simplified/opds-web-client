import { expect } from "chai";
import { stub, spy } from "sinon";

import ActionCreator from "../../actions";

// synchronous actions for simple testing
// of createFetchCollectionAndBook
let fetchCollectionStub = stub().returns(
  new Promise((resolve, reject) => {
    resolve({});
  })
);
let fetchBookStub = stub().returns(
  new Promise((resolve, reject) => {
    resolve({});
  })
);

import {
  mergeRootProps,
  findBookInCollection,
  createFetchCollectionAndBook
} from "../mergeRootProps";
import {
  groupedCollectionData,
  ungroupedCollectionData
} from "./collectionData";

describe("findBookInCollection", () => {
  it("returns nothing if no collection", () => {
    let result = findBookInCollection(null, "test");
    expect(result).to.equal(null);
  });

  it("finds a book in the collection by url", () => {
    let collection = groupedCollectionData;
    let book = groupedCollectionData.lanes[0].books[0];
    if (!book.url) throw new Error("Book is missing url");
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
  let dispatch = stub().returns(
    new Promise<void>((resolve, reject) => resolve())
  );
  let actionFetchCollectionStub;
  let actionBookCollectionStub;

  beforeEach(() => {
    actionFetchCollectionStub = stub(
      ActionCreator.prototype,
      "fetchCollection"
    ).callsFake(() => fetchCollectionStub);
    actionBookCollectionStub = stub(
      ActionCreator.prototype,
      "fetchBook"
    ).callsFake(() => fetchBookStub);
  });

  afterEach(() => {
    actionFetchCollectionStub.restore();
    actionBookCollectionStub.restore();
  });

  it("returns fetch function that uses the provided dispatch", done => {
    let fetchCollectionAndBook = createFetchCollectionAndBook(dispatch);
    fetchCollectionAndBook(collectionUrl, bookUrl)
      .then(({ collectionData, bookData }) => {
        // we are only testing that the provided dispatch is called twice,
        // once for fetchCollection and once for fetchBook
        expect(dispatch.callCount).to.equal(2);
        expect(dispatch.args[0][0]).to.equal(fetchCollectionStub);
        expect(dispatch.args[1][0]).to.equal(fetchBookStub);
        done();
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });
});

describe("mergeRootProps", () => {
  let stateProps, dispatchProps, componentProps;
  let fetchCollection,
    clearCollection,
    fetchBook,
    loadBook,
    clearBook,
    navigate,
    updateBook,
    fetchLoans;
  let fakeCollection = ungroupedCollectionData;
  let fakeBook = {
    id: "fake book id",
    title: "fake book title",
    url: "fake book url"
  };

  beforeEach(() => {
    fetchCollection = spy(url => {
      return new Promise((resolve, reject) => {
        resolve(fakeCollection);
      });
    });
    fetchBook = spy(url => {
      return new Promise((resolve, reject) => {
        resolve(fakeBook);
      });
    });
    loadBook = stub();
    clearCollection = stub();
    clearBook = stub();
    updateBook = spy(url => {
      return new Promise((resolve, reject) => resolve(fakeBook));
    });
    fetchLoans = stub();
    dispatchProps = {
      createDispatchProps: fetcher => {
        return {
          fetchCollection,
          clearCollection,
          loadBook,
          fetchBook,
          clearBook,
          updateBook,
          fetchLoans
        };
      }
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

    it("fetches collection data if given a collection url", done => {
      props
        .setCollection("new collection url")
        .then(data => {
          expect(data).to.equal(fakeCollection);
          expect(fetchCollection.callCount).to.equal(1);
          expect(fetchCollection.args[0][0]).to.equal("new collection url");
          expect(clearCollection.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("does nothing and returns existing data if given the existing collection url", done => {
      props
        .setCollection("test url")
        .then(data => {
          expect(data).to.equal(groupedCollectionData);
          expect(fetchCollection.callCount).to.equal(0);
          expect(clearCollection.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("clears collection data if given a falsy collection url", done => {
      props
        .setCollection(null)
        .then(data => {
          expect(data).not.to.be.ok;
          expect(fetchCollection.callCount).to.equal(0);
          expect(clearCollection.callCount).to.equal(1);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
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

    it("fetches book data if given a book url not in the current collection", done => {
      props
        .setBook("fake book url", groupedCollectionData)
        .then(data => {
          expect(data).to.equal(fakeBook);
          expect(fetchBook.callCount).to.equal(1);
          expect(fetchBook.args[0][0]).to.equal("fake book url");
          expect(clearBook.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("doesn't fetch book data if given a book url in the current collection", done => {
      props
        .setBook(
          groupedCollectionData.lanes[0].books[0].url,
          groupedCollectionData
        )
        .then(data => {
          expect(data).to.equal(groupedCollectionData.lanes[0].books[0]);
          expect(fetchBook.callCount).to.equal(0);
          expect(clearBook.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("does nothing and returns book data if given book data", done => {
      let bookDataWithoutUrl = {
        id: "test id",
        title: "test title"
      };
      props
        .setBook(bookDataWithoutUrl)
        .then(data => {
          expect(data).to.equal(bookDataWithoutUrl);
          expect(fetchBook.callCount).to.equal(0);
          expect(clearBook.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("tries to refresh book data if given the existing book url and no collection", done => {
      props
        .setBook("test book url")
        .then(data => {
          expect(data).to.equal(fakeBook);
          expect(fetchBook.callCount).to.equal(1);
          expect(clearBook.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("clears book data if given a falsy book url", done => {
      props
        .setBook(null)
        .then(data => {
          expect(data).not.to.be.ok;
          expect(fetchBook.callCount).to.equal(0);
          expect(clearBook.callCount).to.equal(1);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
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

    it("does not fetch book if given book url belonging to given collection", done => {
      props
        .setCollectionAndBook(fakeCollection.url, fakeCollection.books[0].url)
        .then(data => {
          expect(data).to.deep.equal({
            collectionData: fakeCollection,
            bookData: fakeCollection.books[0]
          });
          expect(fetchCollection.callCount).to.equal(1);
          expect(fetchCollection.args[0][0]).to.equal(fakeCollection.url);
          expect(fetchBook.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("fetches book if given book url not belonging to given collection", done => {
      props
        .setCollectionAndBook(fakeCollection.url, "fake book url")
        .then(data => {
          expect(data).to.deep.equal({
            collectionData: fakeCollection,
            bookData: fakeBook
          });
          expect(fetchCollection.callCount).to.equal(1);
          expect(fetchCollection.args[0][0]).to.equal(fakeCollection.url);
          expect(fetchBook.callCount).to.equal(1);
          expect(fetchBook.args[0][0]).to.equal("fake book url");
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("fetches book if not given a collection url", done => {
      props
        .setCollectionAndBook(null, "fake book url")
        .then(data => {
          expect(data).to.deep.equal({
            collectionData: null,
            bookData: fakeBook
          });
          expect(fetchCollection.callCount).to.equal(0);
          expect(fetchBook.callCount).to.equal(1);
          expect(fetchBook.args[0][0]).to.equal("fake book url");
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("does nothing and returns existing data if given the existing collection and book urls", done => {
      props
        .setCollectionAndBook(
          stateProps.loadedCollectionUrl,
          stateProps.bookData.url
        )
        .then(data => {
          expect(data).to.deep.equal({
            collectionData: stateProps.collectionData,
            bookData: stateProps.bookData
          });
          expect(fetchCollection.callCount).to.equal(0);
          expect(fetchBook.callCount).to.equal(0);
          expect(clearCollection.callCount).to.equal(0);
          expect(clearBook.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("clears collection and book data if given falsy urls", done => {
      props
        .setCollectionAndBook(null, null)
        .then(data => {
          expect(data).to.deep.equal({
            collectionData: null,
            bookData: null
          });
          expect(fetchCollection.callCount).to.equal(0);
          expect(fetchBook.callCount).to.equal(0);
          expect(clearCollection.callCount).to.equal(1);
          expect(clearBook.callCount).to.equal(1);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
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

    it("calls fetchBook", done => {
      stateProps = {
        loadedCollectionUrl: "test collection",
        loadedBookUrl: "test book"
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props
        .refreshCollectionAndBook()
        .then(data => {
          expect(fetchBook.callCount).to.equal(1);
          expect(fetchBook.args[0][0]).to.equal("test book");
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
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

    it("only fetches book if only book is loaded", done => {
      stateProps = {
        loadedCollectionUrl: null,
        loadedBookUrl: "test book"
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props
        .refreshCollectionAndBook()
        .then(data => {
          expect(fetchBook.callCount).to.equal(1);
          expect(fetchBook.args[0][0]).to.equal("test book");
          expect(fetchCollection.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("does not fetch if neither collection nor book are loaded", done => {
      stateProps = {
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props
        .refreshCollectionAndBook()
        .then(data => {
          expect(fetchCollection.callCount).to.equal(0);
          expect(fetchBook.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
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

      expect(fetchCollection.callCount).to.equal(1);
      expect(fetchCollection.args[0][0]).to.equal("test collection");
    });

    it("calls fetchBook", done => {
      stateProps = {
        collectionUrl: "test collection",
        bookUrl: "test book",
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props
        .retryCollectionAndBook()
        .then(data => {
          expect(fetchBook.callCount).to.equal(1);
          expect(fetchBook.args[0][0]).to.equal("test book");
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
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

      expect(fetchCollection.callCount).to.equal(1);
      expect(fetchCollection.args[0][0]).to.equal("test collection");
      expect(fetchBook.callCount).to.equal(0);
    });

    it("only fetches book if only book is loaded", done => {
      stateProps = {
        collectionUrl: null,
        bookUrl: "test book",
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props
        .retryCollectionAndBook()
        .then(data => {
          expect(fetchBook.callCount).to.equal(1);
          expect(fetchBook.args[0][0]).to.equal("test book");
          expect(fetchCollection.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("does not fetch if neither collection nor book are loaded", done => {
      stateProps = {
        collectionUrl: null,
        bookUrl: null,
        loadedCollectionUrl: null,
        loadedBookUrl: null
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props
        .retryCollectionAndBook()
        .then(data => {
          expect(fetchCollection.callCount).to.equal(0);
          expect(fetchBook.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
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

    it("calls fetchLoans if loansUrl is present", done => {
      stateProps = {
        loansUrl: "loans"
      };
      props = mergeRootProps(stateProps, dispatchProps, componentProps);

      props
        .updateBook()
        .then(data => {
          expect(fetchLoans.callCount).to.equal(1);
          expect(fetchLoans.args[0][0]).to.equal("loans");
          expect(data).to.equal(fakeBook);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });

    it("doesn't call fetchLoans if loansUrl is blank", done => {
      props = mergeRootProps({}, dispatchProps, componentProps);

      props
        .updateBook()
        .then(data => {
          expect(fetchLoans.callCount).to.equal(0);
          done();
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    });
  });
});
