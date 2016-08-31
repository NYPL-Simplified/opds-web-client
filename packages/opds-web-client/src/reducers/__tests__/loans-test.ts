import { expect } from "chai";

import reducer from "../loans";
import DataFetcher from "../../DataFetcher";
import ActionsCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";

let fetcher = new DataFetcher({ adapter });
let actions = new ActionsCreator(fetcher);
let collectionData = {
  url: "collection url",
  title: "title",
  id: "id",
  books: [],
  lanes: [],
  navigationLinks: [],
  shelfUrl: "loans url"
};
let loansData = [{
  id: "book id",
  url: "book url",
  title: "book title"
}];

describe("loans reducer", () => {
  let initState = {
    url: null,
    books: []
  };

  it("returns the initial state", () => {
    expect(reducer(undefined, {})).to.deep.equal(initState);
  });

  it("handles LOAD_COLLECTION", () => {
    let action = actions.loadCollection(collectionData);
    let newState = Object.assign({}, initState, {
      url: "loans url"
    });
    expect(reducer(initState, action)).to.deep.equal(newState);
  });

  it("handles LOAD_COLLECTION for loans feed", () => {
    let oldState = Object.assign({}, initState, {
      url: "loans url"
    });
    let loansCollectionData = Object.assign({}, collectionData, { books: loansData });
    let action = actions.loadCollection(loansCollectionData, "loans url");
    let newState = Object.assign({}, oldState, {
      books: loansData
    });
    expect(reducer(oldState, action)).to.deep.equal(newState);
  });

  it("handles LOAD_LOANS", () => {
    let oldState = Object.assign({}, initState, {
      url: "loans url"
    });
    let action = actions.loadLoans(loansData);
    let newState = Object.assign({}, oldState, {
      books: loansData
    });

    expect(reducer(oldState, action)).to.deep.equal(newState);
  });

  it("clears books on LOAD_UPDATE_BOOK_DATA", () => {
    let oldState = Object.assign({}, initState, {
        books: loansData
    });
    let newBookData = {
      id: "book id",
      url: "book url",
      title: "new book title"
    };
    let action = actions.loadUpdateBookData(newBookData);
    let newState = Object.assign({}, oldState, {
      books: []
    });

    expect(reducer(oldState, action)).to.deep.equal(newState);
  });
});