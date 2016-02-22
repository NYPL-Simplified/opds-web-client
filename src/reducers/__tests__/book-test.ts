jest.dontMock("../book");
jest.dontMock("../../actions");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import reducer from "../book";
import DataFetcher from "../../DataFetcher";
import ActionsCreator from "../../actions";

let fetcher = new DataFetcher(null);
let actions = new ActionsCreator(fetcher);

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

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initState);
  });

  it("should handle FETCH_BOOK_REQUEST", () => {
    let action = actions.fetchBookRequest("some other url");
    let newState = Object.assign({}, bookState, {
      url: action.url,
      isFetching: true
    });

    expect(reducer(bookState, action)).toEqual(newState);
  });

  it("should handle FETCH_BOOK_FAILURE", () => {
    let action = actions.fetchBookFailure("test error");
    let newState = Object.assign({}, fetchingState, {
      isFetching: false,
      error: "test error"
    });

    expect(reducer(fetchingState, action)).toEqual(newState);
  });

  it("should handle LOAD_BOOK", () => {
    let data = {
      id: "some id",
      title: "some title"
    };
    let action = actions.loadBook(data, "some other url");
    let newState = Object.assign({}, bookState, {
      url: "some other url",
      data: data,
      isFetching: false
    });

    expect(reducer(bookState, action)).toEqual(newState);
  });

  it("should handle CLEAR_BOOK", () => {
    let action = actions.clearBook();
    let newState = Object.assign({}, bookState, {
      url: null,
      data: null
    });

    expect(reducer(bookState, action)).toEqual(newState);
  });
});