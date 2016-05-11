jest.dontMock("../collection");
jest.dontMock("../../actions");
jest.setMock("../history", {
  default: (state, action) => state.history
});

import reducer from "../collection";
import DataFetcher from "../../DataFetcher";
import ActionsCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";

let fetcher = new DataFetcher(null, adapter);
let actions = new ActionsCreator(fetcher);

describe("collection reducer", () => {
  let initState = {
    url: null,
    data: null,
    isFetching: false,
    isFetchingPage: false,
    error: null,
    history: []
  };

  let currentState = {
    url: "some url",
    data: {
      id: "id",
      title: "title",
      url: "url",
      lanes: [],
      books: [],
      links: [],
      catalogRootLink: {
        url: "root url",
        text: "root title"
      },
      parentLink: {
        url: "parent url",
        text: "parent title"
      }
    },
    isFetching: false,
    isFetchingPage: false,
    error: null,
    history: []
  };

  let fetchingState = {
    url: "some url",
    data: null,
    isFetching: true,
    isFetchingPage: false,
    error: null,
    history: []
  };

  let fetchingPageState = {
    url: "some url",
    data: {
      id: "id",
      url: "some url",
      title: "some title",
      books: [],
      lanes: [],
      links: []
    },
    isFetching: false,
    isFetchingPage: true,
    error: null,
    history: []
  };

  let errorState = {
    url: null,
    data: null,
    isFetching: false,
    isFetchingPage: false,
    error: {
      status: 500,
      response: "test error",
      url: "some url"
    },
    history: []
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initState);
  });

  it("should handle FETCH_COLLECTION_REQUEST", () => {
    let action = actions.fetchCollectionRequest("some other url");
    let newState = Object.assign({}, errorState, {
      isFetching: true,
      error: null
    });

    expect(reducer(errorState, action)).toEqual(newState);
  });

  it("should handle FETCH_COLLECTION_FAILURE", () => {
    let action = actions.fetchCollectionFailure({
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
    let action = actions.loadCollection(data, "some url");
    let newState = Object.assign({}, errorState, {
      url: "some url",
      data: data,
      isFetching: false,
      error: null
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
    let action = actions.fetchPageFailure({
      status: 500,
      response: "test error",
      url: "error url"
    });
    let newState = Object.assign({}, fetchingPageState, {
      isFetchingPage: false,
      error: {
        status: 500,
        response: "test error",
        url: "error url"
      }
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
    expect(newState.data.search).toBeTruthy();
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