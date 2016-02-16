jest.dontMock("../book");
jest.dontMock("../../actions");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import reducer from "../book";
import {
  loadBook, clearBook
} from "../../actions";

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
  let bookState = Object.assign({}, initState, {
    url: book.url,
    data: book
  });

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initState);
  });

  it("should handle LOAD_BOOK", () => {
    let action = loadBook(book, book.url);
    expect(reducer(initState, action)).toEqual(bookState);
  });

  it("should handle CLEAR_BOOK", () => {
    let action = clearBook();
    expect(reducer(bookState, action)).toEqual(initState);
  });
});