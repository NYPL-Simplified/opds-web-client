import { expect } from "chai";

import reducer from "../book";
import DataFetcher from "../../DataFetcher";
import ActionCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";
import { BookData } from "../../interfaces";

let fetcher = new DataFetcher({ adapter });
let actions = new ActionCreator(fetcher);

describe("book reducer", () => {
  let book = {
    id: "test id",
    url: "test url",
    title: "test title",
    authors: ["test author"],
    summary: "test summary",
    imageUrl: "http://example.com/testthumb.jpg",
    published: "test date",
    publisher: "test publisher"
  };

  let initState = {
    url: null,
    data: null,
    isFetching: false,
    error: null
  };

  let bookState = {
    url: book.url,
    data: book,
    isFetching: false,
    error: null
  };

  let fetchingState = {
    url: book.url,
    data: book,
    isFetching: true,
    error: null
  };

  let errorState = {
    url: null,
    data: null,
    isFetching: false,
    error: {
      status: 500,
      response: "error",
      url: "url"
    }
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).to.deep.equal(initState);
  });

  it("should handle BOOK_REQUEST", () => {
    let action = actions.request(ActionCreator.BOOK, "some other url");
    let newState = {
      ...errorState,
      isFetching: true,
      error: null
    };

    expect(reducer(errorState, action)).to.deep.equal(newState);
  });

  it("should handle BOOK_FAILURE", () => {
    let action = actions.failure(ActionCreator.BOOK, {
      status: 500,
      response: "test error",
      url: "error url"
    });
    let newState = {
      ...fetchingState,
      isFetching: false,
      error: {
        status: 500,
        response: "test error",
        url: "error url"
      }
    };

    expect(reducer(fetchingState, action)).to.deep.equal(newState);
  });

  it("should handle BOOK_LOAD", () => {
    let data = {
      id: "some id",
      title: "some title"
    };
    let action = actions.load<BookData>(
      ActionCreator.BOOK,
      data,
      "some other url"
    );
    let newState = {
      ...bookState,
      url: "some other url",
      data: data,
      isFetching: false
    };

    expect(reducer(bookState, action)).to.deep.equal(newState);
  });

  it("should handle BOOK_CLEAR", () => {
    let action = actions.clear(ActionCreator.BOOK);
    let newState = {
      ...bookState,
      url: null,
      data: null
    };

    expect(reducer(bookState, action)).to.deep.equal(newState);
  });

  it("should preserve empty state on UPDATE_BOOK_LOAD", () => {
    let action = actions.load<BookData>(ActionCreator.UPDATE_BOOK, book, "url");
    expect(reducer(initState, action)).to.deep.equal(initState);
  });

  it("should update book in state on UPDATE_BOOK_LOAD", () => {
    let newBook = { ...book, title: "new title" };
    let action = actions.load<BookData>(
      ActionCreator.UPDATE_BOOK,
      newBook,
      "url"
    );
    let newState = { ...bookState, data: newBook };
    expect(reducer(bookState, action)).to.deep.equal(newState);
  });
});
