jest.dontMock("../history");
jest.dontMock("../../actions");

import reducer, { shouldClear, shorten, addLink, addCollection } from "../history";
import DataFetcher from "../../DataFetcher";
import ActionsCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";
import { CollectionState } from "../collection";

let fetcher = new DataFetcher({ adapter });
let actions = new ActionsCreator(fetcher);

let rootLink = {
  id: null,
  url: "root url",
  text: "root text"
};

let secondLink = {
  id: "second id",
  url: "second url",
  text: "second text"
};

let thirdLink = {
  id: "third id",
  url: "third url",
  text: "third text"
};

let fourthLink = {
  id: "fourth id",
  url: "fourth url",
  text: "fourth text"
};

let longHistory = [
  rootLink,
  secondLink,
  thirdLink
];

let basicCollection = {
  id: "test id",
  url: "test url",
  title: "test title",
  books: [],
  lanes: [],
  navigationLinks: []
};

describe("shouldClear()", () => {
  it("should return true if new collection is old root", () => {
    let newCollection = Object.assign({}, basicCollection, {
      id: "root id",
      url: "root url",
      title: "root text"
    });
    let oldCollection = Object.assign({}, basicCollection, {
      id: "test id",
      url: "test url",
      title: "test title",
      catalogRootLink: rootLink
    });
    let clear = shouldClear(newCollection, oldCollection);
    expect(clear).toBe(true);
  });

  it("should return true if new collection is new root", () => {
    let newCollection = Object.assign({}, basicCollection, {
      id: "test id",
      url: "test url",
      title: "test title",
      catalogRootLink: {
        url: "test url",
        text: "some title"
      }
    });
    let clear = shouldClear(newCollection, basicCollection);
    expect(clear).toBe(true);
  });

  it("should return true if new root is not old root", () => {
    let newCollection = Object.assign({}, basicCollection, {
      id: "some id",
      url: "some url",
      title: "some title",
      catalogRootLink: {
        url: "other url",
        text: "other text"
      }
    });
    let oldCollection = Object.assign({}, basicCollection, {
      id: "test id",
      url: "test url",
      title: "test title",
      catalogRootLink: rootLink
    });
    let clear = shouldClear(newCollection, oldCollection);
    expect(clear).toBe(true);
  });

  it("should return false otherwise", () => {
    let newCollection = Object.assign({}, basicCollection, {
      id: "other id",
      url: "other url",
      title: "other title",
      catalogRootLink: rootLink,
      parentLink: thirdLink
    });
    let oldCollection = Object.assign({}, basicCollection, {
      id: "third id",
      url: "third url",
      title: "third title",
      catalogRootLink: rootLink
    });
    let clear = shouldClear(newCollection, oldCollection);
    expect(clear).toBe(false);
  });
});

describe("shorten()", () => {
  it("should shorten history if it contains new url", () => {
    let newHistory = shorten(longHistory, longHistory[2].url);
    expect(newHistory).toEqual([rootLink, secondLink]);
  });

  it("shouldn't shorten history if it doesn't contain new url", () => {
    let newHistory = shorten(longHistory, "other url");
    expect(newHistory).toBe(longHistory);
  });
});

describe("addLink", () => {
  it("adds a link to a history", () => {
    let newHistory = addLink(longHistory, fourthLink);
    expect(newHistory).toEqual(longHistory.concat([fourthLink]));
  });
});

describe("addCollection", () => {
  it("adds a collection to a history", () => {
    let collection = basicCollection;
    let newHistory = addCollection(longHistory, collection);
    expect(newHistory).toEqual(longHistory.concat([{
      id: collection.id,
      url: collection.url,
      text: collection.title
    }]));
  });
});

describe("history reducer", () => {
  let initState: CollectionState = {
    url: null,
    data: null,
    isFetching: false,
    isFetchingPage: false,
    error: null,
    history: []
  };

  let currentState: CollectionState = {
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

  let errorState: CollectionState = {
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
      navigationLinks: []
    };
    let action = actions.loadCollection(data, "some other url");
    let newHistory = [{
      id: "id",
      text: "title",
      url: "url"
    }];

    expect(reducer(currentState, action)).toEqual(newHistory);
  });

  it("shouldn't change history on LOAD_COLLECTION with same id", () => {
    let data = {
      id: "id",
      url: "some url",
      title: "some title",
      lanes: [],
      books: [],
      navigationLinks: []
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
      navigationLinks: []
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
      navigationLinks: []
    };
    let action = actions.loadCollection(data, "some url");
    let newHistory = [{
      id: null,
      url: "new root url",
      text: "new root title"
    }];

    expect(reducer(stateWithHistory, action)).toEqual(newHistory);
  });

  it("should remove history up to loaded url on LOAD_COLLECTION with url in history", () => {
    let stateWithHistory = Object.assign({}, currentState, {
      history: [{
        id: "first id",
        url: "first url",
        text: "first title"
      }, {
        id: "test id",
        url: "test url",
        text: "test title"
      }, {
        id: "other id",
        url: "other url",
        text: "other title"
      }]
    });
    let data = {
      id: "test id",
      url: "test url",
      title: "test title",
      lanes: [],
      books: [],
      navigationLinks: []
    };
    let action = actions.loadCollection(data, "test url");
    let newHistory = [{
      id: "first id",
      url: "first url",
      text: "first title"
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
      navigationLinks: []
    };
    let action = actions.loadCollection(data, "some url");

    expect(reducer(errorState, action)).toEqual([]);
  });
});