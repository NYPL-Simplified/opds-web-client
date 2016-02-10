jest.dontMock("../collection");
jest.dontMock("../../actions");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import reducer from "../collection";
import {
  fetchCollectionRequest,
  fetchCollectionSuccess,
  fetchCollectionFailure,
  loadCollection,
  clearCollection,
  loadSearchDescription,
  closeError
} from "../../actions";

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
    let action = fetchCollectionRequest("some other url");
    let newState = Object.assign({}, currentState, {
      url: action.url,
      isFetching: true
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("should handle FETCH_COLLECTION_SUCCESS", () => {
    let action = fetchCollectionSuccess();
    let newState = Object.assign({}, fetchingState, {
      isFetching: false
    });

    expect(reducer(fetchingState, action)).toEqual(newState);
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
      title: "some title",
      lanes: [],
      books: [],
      links: []
    };
    let action = loadCollection(data, "some other url");
    let newState = Object.assign({}, currentState, {
      url: "some other url",
      data: data
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("should handle CLEAR_COLLECTION", () => {
    let action = clearCollection();
    let newState = Object.assign({}, currentState, {
      url: null,
      data: null
    });

    expect(reducer(currentState, action)).toEqual(newState);
  });

  it("should handle LOAD_SEARCH_DESCRIPTION", () => {
    let data = {
      description: "d",
      shortName: "s",
      template: (s) => s + " template"
    };
    let action = loadSearchDescription({ data });

    let newState = reducer(currentState, action);
    expect(newState.data.search).toBeTruthy;
    expect(newState.data.search.data.description).toEqual("d");
    expect(newState.data.search.data.shortName).toEqual("s");
    expect(newState.data.search.data.template("test")).toEqual("test template");
  });

  it("should handle CLOSE_ERROR", () => {
    let action = closeError();
    let newState = Object.assign({}, errorState, {
      error: null
    });

    expect(reducer(errorState, action)).toEqual(newState);
  });
});