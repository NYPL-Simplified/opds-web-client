jest.dontMock("../state");
jest.dontMock("../reducers/index");
jest.dontMock("../reducers/collection");
jest.dontMock("../reducers/book");

let fetchCollectionAndBook;
let createFetchCollectionAndBook = jest.genMockFunction();
createFetchCollectionAndBook.mockImplementation((collectionUrl, bookUrl) => fetchCollectionAndBook);
let dispatch = () => {};
jest.setMock("../components/mergeRootProps", { createFetchCollectionAndBook });
jest.setMock("../store", { default: () => { return { dispatch }; } });

import buildInitialState from "../state";

describe("buildInitialState", () => {
  let collectionUrl = "collection url";
  let bookUrl = "book url";

  beforeEach(() => {
    fetchCollectionAndBook = jest.genMockFunction();
    fetchCollectionAndBook.mockReturnValue(new Promise((resolve, reject) => {
      resolve({ collectionData: null, bookData: null });
    }));
    createFetchCollectionAndBook.mockClear();
  });

  it("fetches given collection and book", (done) => {
    buildInitialState(collectionUrl, bookUrl).then(state => {
      expect(createFetchCollectionAndBook.mock.calls.length).toBe(1);
      expect(createFetchCollectionAndBook.mock.calls[0][0]).toBe(dispatch);
      expect(fetchCollectionAndBook.mock.calls.length).toBe(1);
      expect(fetchCollectionAndBook.mock.calls[0][0]).toBe(collectionUrl);
      expect(fetchCollectionAndBook.mock.calls[0][1]).toBe(bookUrl);
      done();
    }).catch(err => done(err));
  });
});