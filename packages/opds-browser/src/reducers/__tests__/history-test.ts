jest.dontMock("../history");
jest.dontMock("../../actions");

import reducer from "../history";
import DataFetcher from "../../DataFetcher";
import ActionsCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";

let fetcher = new DataFetcher(null, adapter);
let actions = new ActionsCreator(fetcher);

describe("history reducer", () => {
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
    let newHistory = [{
      id: "id",
      text: "title",
      url: "url"
    }];

    expect(reducer(currentState, action)).toEqual(newHistory);
  });

  it("should handle LOAD_COLLECTION if new parent url is equal to previous colllection url", () => {
    let stateWithHistory = Object.assign({}, currentState, {
      history: [{
        id: null,
        url: "root url",
        text: "root title"
      }, {
        id: "test id",
        url: "test url",
        text: "test title"
      }]
    });
    let data = {
      id: "some id",
      url: "some url",
      title: "some title",
      lanes: [],
      books: [],
      links: [],
      catalogRootLink: stateWithHistory.data.catalogRootLink,
      parentLink: {
        url: stateWithHistory.data.url,
        text: stateWithHistory.data.title
      }
    };
    let action = actions.loadCollection(data, "some url");
    let newHistory = stateWithHistory.history.concat({
      id: stateWithHistory.data.id,
      text: stateWithHistory.data.title,
      url: stateWithHistory.data.url
    });

    expect(reducer(stateWithHistory, action)).toEqual(newHistory);
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
    let action = actions.loadCollection(data, "some other url");

    expect(reducer(currentState, action)).toEqual(currentState.history);
  });

  it("should clear history on LOAD_COLLECTION with the old catalog root", () => {
    let stateWithHistory = Object.assign({}, currentState, {
      history: [{
        id: "test id",
        url: "test url",
        text: "test title"
      }]
    });
    let data = {
      id: "some id",
      url: "root url",
      title: "root title",
      lanes: [],
      books: [],
      links: []
    };
    let action = actions.loadCollection(data, "root url");

    expect(reducer(stateWithHistory, action)).toEqual([]);
  });

  it("should clear history on LOAD_COLLECTION with a new catalog", () => {
    let stateWithHistory = Object.assign({}, currentState, {
      history: [{
        id: "test id",
        url: "test url",
        title: "test title"
      }]
    });
    let data = {
      id: "some id",
      url: "some url",
      title: "some title",
      catalogRootLink: {
        url: "new root url",
        text: "new root title"
      },
      lanes: [],
      books: [],
      links: []
    };
    let action = actions.loadCollection(data, "some url");
    let newHistory = [{
      id: null,
      url: "new root url",
      text: "new root title"
    }];

    expect(reducer(stateWithHistory, action)).toEqual(newHistory);
  });

  it("should set history to root and parent on LOAD_COLLECTION if it's not there", () => {
    let data = {
      id: "some id",
      url: "some url",
      title: "some title",
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
    };
    let action = actions.loadCollection(data, "some url");
    let newHistory = [{
      text: "root title",
      url: "root url",
      id: null
    }, {
      text: "parent title",
      url: "parent url",
      id: null
    }];

    expect(reducer(currentState, action)).toEqual(newHistory);
  });

  it("should set history to root and parent on LOAD_COLLECTION if parent url is different than last history url", () => {
    let oldState = Object.assign({}, currentState, {
      history: [
        {
          id: null,
          text: "old root title",
          url: "old root url"
        }, {
          id: "some other id",
          url: "some other url",
          text: "some other title"
        }
      ]
    });
    let data = {
      id: "some id",
      url: "some url",
      title: "some title",
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
    };
    let action = actions.loadCollection(data, "some url");
    let newHistory = [{
      id: null,
      text: "root title",
      url: "root url"
    }, {
      id: null,
      text: "parent title",
      url: "parent url"
    }];

    expect(reducer(oldState, action)).toEqual(newHistory);
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
    let action = actions.loadCollection(data, "test url");
    let newHistory = [{
      id: "first id",
      url: "first url",
      title: "first title"
    }];

    expect(reducer(stateWithHistory, action)).toEqual(newHistory);
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

    expect(reducer(errorState, action)).toEqual([]);
  });
});