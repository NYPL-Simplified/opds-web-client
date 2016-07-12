jest.dontMock("../book");
jest.dontMock("../../actions");

import reducer from "../book";
import DataFetcher from "../../DataFetcher";
import ActionsCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";

let fetcher = new DataFetcher(null, adapter);
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

  let errorState = {
    url: null,
    data: null,
    isFetching: false,
    error: {
      status: 500,
      response: "error",
      url: "url",
    }
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initState);
  });

  it("should handle FETCH_BOOK_REQUEST", () => {
    let action = actions.fetchBookRequest("some other url");
    let newState = Object.assign({}, errorState, {
      isFetching: true,
      error: null
    });

    expect(reducer(errorState, action)).toEqual(newState);
  });

  it("should handle FETCH_BOOK_FAILURE", () => {
    let action = actions.fetchBookFailure({
      status: 500,
      response: "test error",
      url: "error url"
    });
    let newState = Object.assign({}, fetchingState, {
      isFetching: false,
      error: {
        status: 500,
        response: "test error",
        url: "error url"
      }
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