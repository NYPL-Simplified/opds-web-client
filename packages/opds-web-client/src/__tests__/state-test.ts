jest.dontMock("../state");
jest.dontMock("../reducers/index");
jest.dontMock("../reducers/collection");
jest.dontMock("../reducers/book");

let fetchCollectionAndBook;
let createFetchCollectionAndBook = jest.genMockFunction();
createFetchCollectionAndBook.mockImplementation((collectionUrl, bookUrl) => fetchCollectionAndBook);
let dispatch = () => {};
let initialState = "initial state";
let alteredState = "state with collection and book";
let testState = initialState;
jest.setMock("../components/mergeRootProps", { createFetchCollectionAndBook });
jest.setMock("../store", { default: () => { return { dispatch, getState: () => testState }; } });

import buildInitialState from "../state";

describe("buildInitialState", () => {
  let collectionUrl = "collection url";
  let bookUrl = "book url";

  beforeEach(() => {
    fetchCollectionAndBook = jest.genMockFunction();
    fetchCollectionAndBook.mockReturnValue(new Promise((resolve, reject) => {
      testState = alteredState;
      resolve({ collectionData: null, bookData: null });
    }));
    createFetchCollectionAndBook.mockClear();
  });

  it("fetches given collection and book into state", (done) => {
    buildInitialState(collectionUrl, bookUrl).then(state => {
      expect(createFetchCollectionAndBook.mock.calls.length).toBe(1);
      expect(createFetchCollectionAndBook.mock.calls[0][0]).toBe(dispatch);
      expect(fetchCollectionAndBook.mock.calls.length).toBe(1);
      expect(fetchCollectionAndBook.mock.calls[0][0]).toBe(collectionUrl);
      expect(fetchCollectionAndBook.mock.calls[0][1]).toBe(bookUrl);
      expect(state).toBe(alteredState);
      done();
    }).catch(err => done(err));
  });
});