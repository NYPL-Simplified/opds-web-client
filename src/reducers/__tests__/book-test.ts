jest.dontMock("../book");
jest.dontMock("../../actions");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import reducer from "../book";
import {
  showBookDetails, hideBookDetails
} from "../../actions";

describe("book reducer", () => {
  let book = {
    id: "test id",
    title: "test title",
    authors: ["test author"],
    summary: "test summary",
    imageUrl: "http://example.com/testthumb.jpg",
    published: "test date",
    publisher: "test publisher"
  };
  let initState = null;
  let bookState = Object.assign({}, book);

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initState);
  });

  it("should handle SHOW_BOOK_DETAILS", () => {
    let action = showBookDetails(book);
    expect(reducer(initState, action)).toEqual(bookState);
  });

  it("should handle HIDE_BOOK_DETAILS", () => {
    let action = hideBookDetails();
    expect(reducer(bookState, action)).toEqual(initState);
  });
});