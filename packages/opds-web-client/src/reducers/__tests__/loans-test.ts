jest.dontMock("../loans");
jest.dontMock("../../actions");

import reducer from "../loans";
import DataFetcher from "../../DataFetcher";
import ActionsCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";

let fetcher = new DataFetcher({ adapter });
let actions = new ActionsCreator(fetcher);
let collectionData = {
  url: "collection url",
  title: "title",
  id: "id",
  books: [],
  lanes: [],
  links: [],
  shelfUrl: "loans url"
};
let loansData = [{
  id: "book id",
  url: "book url",
  title: "book title"
}];

describe("loans reducer", () => {
  let initState = {
    url: null,
    books: []
  };

  it("returns the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initState);
  });

  it("handles LOAD_COLLECTION", () => {
    let action = actions.loadCollection(collectionData);
    let newState = Object.assign({}, initState, {
      url: "loans url"
    });
    expect(reducer(initState, action)).toEqual(newState);
  });

  it("handles LOAD_LOANS", () => {
    let oldState = Object.assign({}, initState, {
      url: "loans url"
    });
    let action = actions.loadLoans(loansData);
    let newState = Object.assign({}, oldState, {
      books: loansData
    });

    expect(reducer(oldState, action)).toEqual(newState);
  });
});