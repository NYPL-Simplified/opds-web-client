import { expect } from "chai";
import { stub } from "sinon";

import * as history from "../history";

import reducer from "../collection";
import DataFetcher from "../../DataFetcher";
import ActionCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";
import { CollectionData, SearchData } from "../../interfaces";

let fetcher = new DataFetcher({ adapter });
let actions = new ActionCreator(fetcher);

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
      navigationLinks: [],
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
      navigationLinks: []
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

  let historyStub;

  beforeEach(() => {
    historyStub = stub(history, "default").callsFake(
      (state, action) => state.history
    );
  });

  afterEach(() => {
    historyStub.restore();
  });

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).to.deep.equal(initState);
  });

  it("should handle COLLECTION_REQUEST", () => {
    let action = actions.request(ActionCreator.COLLECTION, "some other url");
    let newState = {
      ...errorState,
      isFetching: true,
      error: null
    };

    expect(reducer(errorState, action)).to.deep.equal(newState);
  });

  it("should handle COLLECTION_FAILURE", () => {
    let action = actions.failure(ActionCreator.COLLECTION, {
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

  it("should handle COLLECTION_LOAD", () => {
    let data = {
      id: "some id",
      url: "some url",
      title: "some title",
      lanes: [],
      books: [],
      navigationLinks: []
    };
    let action = actions.load<CollectionData>(
      ActionCreator.COLLECTION,
      data,
      "some other url"
    );
    let newState = {
      ...currentState,
      url: "some other url",
      data: data,
      isFetching: false
    };

    expect(reducer(currentState, action)).to.deep.equal(newState);
  });

  it("should handle COLLECTION_LOAD after an error", () => {
    let data = {
      id: "some id",
      url: "some url",
      title: "some title",
      lanes: [],
      books: [],
      navigationLinks: []
    };
    let action = actions.load<CollectionData>(
      ActionCreator.COLLECTION,
      data,
      "some url"
    );
    let newState = {
      ...errorState,
      url: "some url",
      data: data,
      isFetching: false,
      error: null
    };

    expect(reducer(errorState, action)).to.deep.equal(newState);
  });

  it("should handle COLLECTION_CLEAR", () => {
    let action = actions.clear(ActionCreator.COLLECTION);
    let newState = {
      ...currentState,
      url: null,
      data: null
    };

    expect(reducer(currentState, action)).to.deep.equal(newState);
  });

  it("should handle PAGE_REQUEST", () => {
    let action = actions.request(ActionCreator.PAGE, "some other url");
    let newState = {
      ...currentState,
      pageUrl: "some other url",
      isFetchingPage: true
    };

    expect(reducer(currentState, action)).to.deep.equal(newState);
  });

  it("should handle PAGE_FAILURE", () => {
    let action = actions.failure(ActionCreator.PAGE, {
      status: 500,
      response: "test error",
      url: "error url"
    });
    let newState = {
      ...fetchingPageState,
      isFetchingPage: false,
      error: {
        status: 500,
        response: "test error",
        url: "error url"
      }
    };

    expect(reducer(fetchingPageState, action)).to.deep.equal(newState);
  });

  it("should handle PAGE_LOAD", () => {
    let data = {
      id: "some id",
      url: "test url",
      title: "some title",
      lanes: [],
      books: [
        {
          id: "new book",
          title: "new title",
          authors: [],
          summary: "new summary",
          imageUrl: "",
          publisher: ""
        }
      ],
      navigationLinks: [],
      nextPageUrl: "next"
    };
    let action = actions.load<CollectionData>(ActionCreator.PAGE, data);
    let newState = {
      ...fetchingPageState,
      data: {
        ...fetchingPageState.data,
        books: data.books,
        nextPageUrl: "next"
      },
      isFetchingPage: false
    };

    expect(reducer(fetchingPageState, action)).to.deep.equal(newState);
  });

  it("should handle SEARCH_DESCRIPTION_LOAD", () => {
    let searchData = {
      description: "d",
      shortName: "s",
      template: s => s + " template"
    };
    let action = actions.load<SearchData>(ActionCreator.SEARCH_DESCRIPTION, {
      searchData
    });

    let newState = reducer(currentState, action);
    expect(newState.data?.search).to.be.ok;
    expect(newState.data?.search?.searchData?.description).to.equal("d");
    expect(newState.data?.search?.searchData?.shortName).to.equal("s");
    expect(newState.data?.search?.searchData?.template("test")).to.equal(
      "test template"
    );
  });

  it("should handle CLOSE_ERROR", () => {
    let action = actions.closeError();
    let newState = { ...errorState, error: null };

    expect(reducer(errorState, action)).to.deep.equal(newState);
  });
});
