jest.dontMock("../collection");
jest.dontMock("../../actions");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import reducer from "../collection";
import {
  fetchCollectionRequest, loadCollection, loadSearchDescription
} from "../../actions";

describe("collection reducer", () => {
  let initState = {
    url: null,
    data: null,
    isFetching: false
  };

  let currentState = {
    url: "some url",
    data: { foo: "bar" },
    isFetching: false
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initState);
  });

  it("should handle FETCH_COLLECTION_REQUEST", () => {
    let action = fetchCollectionRequest("some other url");

    expect(reducer(currentState, action)).toEqual({
      url: "some other url",
      data: currentState.data,
      isFetching: true
    });
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

    expect(reducer(currentState, action)).toEqual({
      url: "some other url",
      data: data,
      isFetching: false
    });
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
});