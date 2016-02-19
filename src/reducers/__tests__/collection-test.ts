jest.dontMock("../collection");
jest.dontMock("../../actions");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import reducer from "../collection";
import DataFetcher from "../../DataFetcher";
import ActionsCreator from "../../actions";

let fetcher = new DataFetcher(null);
let actions = new ActionsCreator(fetcher);

describe("collection reducer", () => {
  let initState = {
    url: null,
    data: null,
    isFetching: false,
    error: null
  };

  let currentState = {
    url: "some url",
    data: { foo: "bar" },
    isFetching: false,
    error: null
  };

  let fetchingState = {
    url: "some url",
    data: { foo: "bar "},
    isFetching: true,
    error: null
  };

  let fetchingPageState = {
    url: "some url",
    data: { foo: "bar ", books: []},
    isFetching: false,
    isFetchingPage: true,
    error: null
  };

  let errorState = {
    url: "some url",
    data: null,
    isFetching: false,
    error: "test error"
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initState);
  });

  it("should handle FETCH_COLLECTION_REQUEST", () => {
    let action = actions.fetchCollectionRequest("some other url");
    let newState = Object.assign({}, currentState, {
      url: action.url,
      isFetching: true
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("should handle FETCH_COLLECTION_FAILURE", () => {
    let action = actions.fetchCollectionFailure("test error");
    let newState = Object.assign({}, fetchingState, {
      isFetching: false,
      error: "test error"
    });

    expect(reducer(fetchingState, action)).toEqual(newState);
  });

  it("should handle LOAD_COLLECTION", () => {
    let data = {
      id: "some id",
      url: "some url",
      title: "some title",
      lanes: [],
      books: [],
      links: []
    };
    let action = actions.loadCollection(data, "some other url");
    let newState = Object.assign({}, currentState, {
      url: "some other url",
      data: data,
      isFetching: false
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("should handle LOAD_COLLECTION after an error", () => {
    let data = {
      id: "some id",
      url: "some url",
      title: "some title",
      lanes: [],
      books: [],
      links: []
    };
    let action = actions.loadCollection(data, "some other url");
    let newState = Object.assign({}, currentState, {
      url: "some other url",
      data: data,
      isFetching: false
    });

    expect(reducer(errorState, action)).toEqual(newState);
  });

  it("should handle CLEAR_COLLECTION", () => {
    let action = actions.clearCollection();
    let newState = Object.assign({}, currentState, {
      url: null,
      data: null
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("should handle FETCH_PAGE_REQUEST", () => {
    let action = actions.fetchPageRequest("some other url");
    let newState = Object.assign({}, currentState, {
      pageUrl: "some other url",
      isFetchingPage: true
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("should handle FETCH_PAGE_FAILURE", () => {
    let action = actions.fetchPageFailure("test error");
    let newState = Object.assign({}, fetchingPageState, {
      isFetchingPage: false,
      error: "test error"
    });

    expect(reducer(fetchingPageState, action)).toEqual(newState);
  });

  it("should handle LOAD_PAGE", () => {
    let data = {
      id: "some id",
      url: "test url",
      title: "some title",
      lanes: [],
      books: [{
        id: "new book",
        title: "new title",
        authors: [],
        summary: "new summary",
        imageUrl: "",
        publisher: ""
      }],
      links: [],
      nextPageUrl: "next"
    };
    let action = actions.loadPage(data);
    let newState = Object.assign({}, fetchingPageState, {
      data: Object.assign({}, fetchingPageState.data, {
        books: data.books,
        nextPageUrl: "next"
      }),
      isFetchingPage: false
    });

    expect(reducer(fetchingPageState, action)).toEqual(newState);
  });

  it("should handle LOAD_SEARCH_DESCRIPTION", () => {
    let searchData = {
      description: "d",
      shortName: "s",
      template: (s) => s + " template"
    };
    let action = actions.loadSearchDescription({ searchData });

    let newState = reducer(currentState, action);
    expect(newState.data.search).toBeTruthy;
    expect(newState.data.search.searchData.description).toEqual("d");
    expect(newState.data.search.searchData.shortName).toEqual("s");
    expect(newState.data.search.searchData.template("test")).toEqual("test template");
  });

  it("should handle CLOSE_ERROR", () => {
    let action = actions.closeError();
    let newState = Object.assign({}, errorState, {
      error: null
    });

    expect(reducer(errorState, action)).toEqual(newState);
  });
});