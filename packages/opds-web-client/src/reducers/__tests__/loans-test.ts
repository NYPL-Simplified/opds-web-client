import { expect } from "chai";

import reducer from "../loans";
import DataFetcher from "../../DataFetcher";
import ActionCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";
import { CollectionData, BookData } from "../../interfaces";

let fetcher = new DataFetcher({ adapter });
let actions = new ActionCreator(fetcher);
let collectionData = {
  url: "collection url",
  title: "title",
  id: "id",
  books: [],
  lanes: [],
  navigationLinks: [],
  shelfUrl: "loans url"
};
let loansData = {
  url: "collection url",
  title: "title",
  id: "id",
  books: [
    {
      id: "book id",
      url: "book url",
      title: "book title"
    }
  ],
  lanes: [],
  navigationLinks: []
};

describe("loans reducer", () => {
  let initState = {
    url: null,
    books: []
  };

  it("returns the initial state", () => {
    expect(reducer(undefined, {})).to.deep.equal(initState);
  });

  it("handles COLLECTION_LOAD", () => {
    let action = actions.load<CollectionData>(
      ActionCreator.COLLECTION,
      collectionData
    );
    let newState = { ...initState, url: "loans url" };
    expect(reducer(initState, action)).to.deep.equal(newState);
  });

  it("handles COLLECTION_LOAD for loans feed", () => {
    let oldState = { ...initState, url: "loans url" };
    let loansCollectionData = { ...collectionData, books: loansData.books };
    let action = actions.load<CollectionData>(
      ActionCreator.COLLECTION,
      loansCollectionData,
      "loans url"
    );
    let newState = { ...oldState, books: loansData.books };
    expect(reducer(oldState, action)).to.deep.equal(newState);
  });

  it("handles LOANS_LOAD", () => {
    let oldState = { ...initState, url: "loans url" };
    let action = actions.load<CollectionData>(ActionCreator.LOANS, loansData);
    let newState = { ...oldState, books: loansData.books };

    expect(reducer(oldState, action)).to.deep.equal(newState);
  });

  it("clears books on CLEAR_AUTH_CREDENTIALS", () => {
    let oldState = { ...initState, books: loansData.books };
    let action = actions.clearAuthCredentials();
    let newState = { ...oldState, books: [] };
    expect(reducer(oldState, action)).to.deep.equal(newState);
  });

  it("removes book that's no longer borrowed on UPDATE_BOOK_LOAD", () => {
    let oldState = { ...initState, books: loansData.books };
    let newBookData = {
      id: "book id",
      url: "book url",
      title: "new book title"
    };
    let action = actions.load<BookData>(ActionCreator.UPDATE_BOOK, newBookData);
    let newState = { ...oldState, books: [] };

    expect(reducer(oldState, action)).to.deep.equal(newState);
  });

  it("adds newly borrowed book on UPDATE_BOOK_LOAD", () => {
    let oldState = { ...initState, books: loansData.books };
    let newBookData: BookData = {
      id: "new book id",
      url: "new book url",
      title: "new book title",
      fulfillmentLinks: [
        { url: "url", type: "application/pdf", indirectType: "" }
      ]
    };
    let action = actions.load<BookData>(ActionCreator.UPDATE_BOOK, newBookData);
    let newState = { ...oldState, books: [loansData.books[0], newBookData] };

    expect(reducer(oldState, action)).to.deep.equal(newState);
  });

  it("adds newly reserved book on UPDATE_BOOK_LOAD", () => {
    let oldState = { ...initState, books: loansData.books };
    let newBookData: BookData = {
      id: "new book id",
      url: "new book url",
      title: "new book title",
      availability: { status: "reserved" }
    };
    let action = actions.load<BookData>(ActionCreator.UPDATE_BOOK, newBookData);
    let newState = { ...oldState, books: [loansData.books[0], newBookData] };

    expect(reducer(oldState, action)).to.deep.equal(newState);
  });
});
