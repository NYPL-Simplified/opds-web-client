jest.dontMock("../collection");
jest.dontMock("../../actions");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import reducer from "../collection";
import {
  fetchCollectionRequest,
  fetchCollectionFailure,
  loadCollection,
  fetchPageRequest,
  fetchPageFailure,
  loadPage,
  clearCollection,
  loadSearchDescription,
  closeError
} from "../../actions";

describe("collection reducer", () => {
  let initState = {
    url: null,
    data: null,
    isFetching: false,
    error: null,
    history: []
  };

  let currentState = {
    url: "some url",
    data: {
      foo: "bar",
      id: "id",
      title: "title",
      url: "url"
    },
    isFetching: false,
    error: null,
    history: []
  };

  let fetchingState = {
    url: "some url",
    data: { foo: "bar "},
    isFetching: true,
    error: null,
    history: []
  };

  let fetchingPageState = {
    url: "some url",
    data: { foo: "bar ", books: []},
    isFetching: false,
    isFetchingPage: true,
    error: null,
    history: []
  };

  let errorState = {
    url: "some url",
    data: null,
    isFetching: false,
    error: "test error",
    history: []
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initState);
  });

  it("should handle FETCH_COLLECTION_REQUEST", () => {
    let action = fetchCollectionRequest("some other url");
    let newState = Object.assign({}, currentState, {
      url: action.url,
      isFetching: true
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("should handle FETCH_COLLECTION_FAILURE", () => {
    let action = fetchCollectionFailure("test error");
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
    let action = loadCollection(data, "some other url");
    let newState = Object.assign({}, currentState, {
      url: "some other url",
      data: data,
      isFetching: false,
      history: [{
        id: "id",
        text: "title",
        url: "url"
      }]
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("shouldn't change history on LOAD_COLLECTION with same id", () => {
    let data = {
      id: "id",
      url: "some url",
      title: "some title",
      lanes: [],
      books: [],
      links: []
    };
    let action = loadCollection(data, "some other url");
    let newState = Object.assign({}, currentState, {
      url: "some other url",
      data: data,
      isFetching: false
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("shouldn't change history on LOAD_COLLECTION with same title", () => {
    let data = {
      id: "some id",
      url: "some url",
      title: "title",
      lanes: [],
      books: [],
      links: []
    };
    let action = loadCollection(data, "some other url");
    let newState = Object.assign({}, currentState, {
      url: "some other url",
      data: data,
      isFetching: false
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("should clear history on LOAD_COLLECTION with the catalog root", () => {
    let stateWithHistory = Object.assign({}, currentState, {
      history: [{
        id: "test id",
        url: "test url",
        title: "test title"
      }],
      data: Object.assign({}, currentState.data, {
        catalogRootUrl: "root url"
      })
    });
    let data = {
      id: "some id",
      url: "root url",
      title: "some title",
      lanes: [],
      books: [],
      links: []
    };
    let action = loadCollection(data, "root url");
    let newState = Object.assign({}, currentState, {
      url: "root url",
      data: data,
      isFetching: false,
      history: []
    });

    expect(reducer(stateWithHistory, action)).toEqual(newState);
  });

  it("should remove last history entry on LOAD_COLLECTION with that url", () => {
    let stateWithHistory = Object.assign({}, currentState, {
      history: [{
        id: "test id",
        url: "test url",
        title: "test title"
      }]
    });
    let data = {
      id: "some id",
      url: "test url",
      title: "some title",
      lanes: [],
      books: [],
      links: []
    };
    let action = loadCollection(data, "test url");
    let newState = Object.assign({}, currentState, {
      url: "test url",
      data: data,
      isFetching: false,
      history: []
    });

    expect(reducer(stateWithHistory, action)).toEqual(newState);
  });

  it("should remove history up to loaded url on LOAD_COLLECTION with url in history", () => {
    let stateWithHistory = Object.assign({}, currentState, {
      history: [{
        id: "first id",
        url: "first url",
        title: "first title"
      }, {
        id: "test id",
        url: "test url",
        title: "test title"
      }, {
        id: "other id",
        url: "other url",
        title: "other title"
      }]
    });
    let data = {
      id: "some id",
      url: "test url",
      title: "some title",
      lanes: [],
      books: [],
      links: []
    };
    let action = loadCollection(data, "test url");
    let newState = Object.assign({}, currentState, {
      url: "test url",
      data: data,
      isFetching: false,
      history: [{
        id: "first id",
        url: "first url",
        title: "first title"
      }]
    });

    expect(reducer(stateWithHistory, action)).toEqual(newState);
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
    let action = loadCollection(data, "some other url");
    let newState = Object.assign({}, currentState, {
      url: "some other url",
      data: data,
      isFetching: false
    });

    expect(reducer(errorState, action)).toEqual(newState);
  });

  it("should handle CLEAR_COLLECTION", () => {
    let action = clearCollection();
    let newState = Object.assign({}, currentState, {
      url: null,
      data: null
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("should handle FETCH_PAGE_REQUEST", () => {
    let action = fetchPageRequest("some other url");
    let newState = Object.assign({}, currentState, {
      pageUrl: "some other url",
      isFetchingPage: true
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("should handle FETCH_PAGE_FAILURE", () => {
    let action = fetchPageFailure("test error");
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
    let action = loadPage(data);
    let newState = Object.assign({}, fetchingPageState, {
      data: Object.assign({}, fetchingPageState.data, {
        books: data.books,
        nextPageUrl: "next"
      }),
      isFetching: false
    });

    expect(reducer(fetchingPageState, action)).toEqual(newState);
  });

  it("should handle LOAD_SEARCH_DESCRIPTION", () => {
    let searchData = {
      description: "d",
      shortName: "s",
      template: (s) => s + " template"
    };
    let action = loadSearchDescription({ searchData });

    let newState = reducer(currentState, action);
    expect(newState.data.search).toBeTruthy;
    expect(newState.data.search.searchData.description).toEqual("d");
    expect(newState.data.search.searchData.shortName).toEqual("s");
    expect(newState.data.search.searchData.template("test")).toEqual("test template");
  });

  it("should handle CLOSE_ERROR", () => {
    let action = closeError();
    let newState = Object.assign({}, errorState, {
      error: null
    });

    expect(reducer(errorState, action)).toEqual(newState);
  });
});