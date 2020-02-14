import { expect } from "chai";

import reducer, {
  shouldClear,
  shorten,
  addLink,
  addCollection
} from "../history";
import DataFetcher from "../../DataFetcher";
import ActionCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";
import { CollectionState } from "../collection";
import { CollectionData } from "../../interfaces";

let fetcher = new DataFetcher({ adapter });
let actions = new ActionCreator(fetcher);

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

let longHistory = [rootLink, secondLink, thirdLink];

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
    let newCollection = {
      ...basicCollection,
      id: "root id",
      url: "root url",
      title: "root text"
    };
    let oldCollection = {
      ...basicCollection,
      id: "test id",
      url: "test url",
      title: "test title",
      catalogRootLink: rootLink
    };
    let clear = shouldClear(newCollection, oldCollection);
    expect(clear).to.equal(true);
  });

  it("should return true if new collection is new root", () => {
    let newCollection = {
      ...basicCollection,
      id: "test id",
      url: "test url",
      title: "test title",
      catalogRootLink: {
        url: "test url",
        text: "some title"
      }
    };
    let clear = shouldClear(newCollection, basicCollection);
    expect(clear).to.equal(true);
  });

  it("should return true if new root is not old root", () => {
    let newCollection = {
      ...basicCollection,
      id: "some id",
      url: "some url",
      title: "some title",
      catalogRootLink: {
        url: "other url",
        text: "other text"
      }
    };
    let oldCollection = {
      ...basicCollection,
      id: "test id",
      url: "test url",
      title: "test title",
      catalogRootLink: rootLink
    };
    let clear = shouldClear(newCollection, oldCollection);
    expect(clear).to.equal(true);
  });

  it("should return false otherwise", () => {
    let newCollection = {
      ...basicCollection,
      id: "other id",
      url: "other url",
      title: "other title",
      catalogRootLink: rootLink,
      parentLink: thirdLink
    };
    let oldCollection = {
      ...basicCollection,
      id: "third id",
      url: "third url",
      title: "third title",
      catalogRootLink: rootLink
    };
    let clear = shouldClear(newCollection, oldCollection);
    expect(clear).to.equal(false);
  });
});

describe("shorten()", () => {
  it("should shorten history if it contains new url", () => {
    let newHistory = shorten(longHistory, longHistory[2].url);
    expect(newHistory).to.deep.equal([rootLink, secondLink]);
  });

  it("shouldn't shorten history if it doesn't contain new url", () => {
    let newHistory = shorten(longHistory, "other url");
    expect(newHistory).to.deep.equal(longHistory);
  });
});

describe("addLink", () => {
  it("adds a link to a history", () => {
    let newHistory = addLink(longHistory, fourthLink);
    expect(newHistory).to.deep.equal(longHistory.concat([fourthLink]));
  });
});

describe("addCollection", () => {
  it("adds a collection to a history", () => {
    let collection = basicCollection;
    let newHistory = addCollection(longHistory, collection);
    expect(newHistory).to.deep.equal(
      longHistory.concat([
        {
          id: collection.id,
          url: collection.url,
          text: collection.title
        }
      ])
    );
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
    let newHistory = [
      {
        id: "id",
        text: "title",
        url: "url"
      }
    ];

    expect(reducer(currentState, action)).to.deep.equal(newHistory);
  });

  it("shouldn't change history on COLLECTION_LOAD with same id", () => {
    let data = {
      id: "id",
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
    expect(reducer(currentState, action)).to.deep.equal(currentState.history);
  });

  it("should clear history on COLLECTION_LOAD with the old catalog root", () => {
    let stateWithHistory = {
      ...currentState,
      history: [
        {
          id: "test id",
          url: "test url",
          text: "test title"
        }
      ]
    };
    let data = {
      id: "some id",
      url: "root url",
      title: "root title",
      lanes: [],
      books: [],
      navigationLinks: []
    };
    let action = actions.load<CollectionData>(
      ActionCreator.COLLECTION,
      data,
      "root url"
    );
    expect(reducer(stateWithHistory, action)).to.deep.equal([]);
  });

  it("should clear history on COLLECTION_LOAD with a new catalog", () => {
    let stateWithHistory = {
      ...currentState,
      history: [
        {
          id: "test id",
          url: "test url",
          text: "test title"
        }
      ]
    };
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
    let action = actions.load<CollectionData>(
      ActionCreator.COLLECTION,
      data,
      "some url"
    );
    let newHistory = [
      {
        id: null,
        url: "new root url",
        text: "new root title"
      }
    ];

    expect(reducer(stateWithHistory, action)).to.deep.equal(newHistory);
  });

  it("should remove history up to loaded url on COLLECTION_LOAD with url in history", () => {
    let stateWithHistory = {
      ...currentState,
      history: [
        {
          id: "first id",
          url: "first url",
          text: "first title"
        },
        {
          id: "test id",
          url: "test url",
          text: "test title"
        },
        {
          id: "other id",
          url: "other url",
          text: "other title"
        }
      ]
    };
    let data = {
      id: "test id",
      url: "test url",
      title: "test title",
      catalogRootLink: {
        url: "root url"
      },
      lanes: [],
      books: [],
      navigationLinks: []
    };
    let action = actions.load<CollectionData>(
      ActionCreator.COLLECTION,
      data,
      "test url"
    );
    let newHistory = [
      {
        id: "first id",
        url: "first url",
        text: "first title"
      }
    ];

    expect(reducer(stateWithHistory, action)).to.deep.equal(newHistory);
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

    expect(reducer(errorState, action)).to.deep.equal([]);
  });
});
