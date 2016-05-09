jest.dontMock("../hierarchy");
jest.dontMock("../../actions");

import reducer from "../hierarchy";
import DataFetcher from "../../DataFetcher";
import ActionsCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";
import { CollectionState } from "../collection";

let fetcher = new DataFetcher(null, adapter);
let actions = new ActionsCreator(fetcher);

describe("hierarchy reducer", () => {
  let oldState = [
    {
      url: "root url",
      text: "root title"
    },
    {
      url: "parent url",
      text: "parent title"
    }
  ];

  let collectionDataWithoutHierarchy = {
    id: "new id",
    url: "new url",
    title: "new title",
    lanes: [],
    books: [],
    links: []
  };

  it("returns empty without root or uplink", () => {
    let data = collectionDataWithoutHierarchy;
    let action = actions.loadCollection(data, "new url");
    expect(reducer(oldState, action)).toEqual([]);
  });

  it("returns root if only root is present", () => {
    let catalogRootLink = {
      url: "new root url",
      text: "new root url"
    };
    let data = Object.assign({}, collectionDataWithoutHierarchy, { catalogRootLink });
    let action = actions.loadCollection(data, "new url");
    expect(reducer(oldState, action)).toEqual([catalogRootLink]);
  });

  it("provides default catalog root title", () => {
    let catalogRootLink = {
      url: "new root url",
      text: null
    };
    let data = Object.assign({}, collectionDataWithoutHierarchy, { catalogRootLink });
    let action = actions.loadCollection(data, "new url");
    expect(reducer(oldState, action)).toEqual([{
      url: catalogRootLink.url,
      text: "Catalog"
    }]);
  });

  it("returns uplink if only uplink is present", () => {
    let parentLink = {
      url: "new parent url",
      text: "new parent text"
    };
    let data = Object.assign({}, collectionDataWithoutHierarchy, { parentLink });
    let action = actions.loadCollection(data, "new url");
    expect(reducer(oldState, action)).toEqual([parentLink]);
  });

  it("returns only root if uplink is same as root", () => {
    let catalogRootLink = {
      url: "new root url",
      text: "new root text"
    };
    let parentLink = {
      url: "new root url",
      text: "new root text"
    };
    let data = Object.assign({}, collectionDataWithoutHierarchy, { catalogRootLink, parentLink });
    let action = actions.loadCollection(data, "new url");
    expect(reducer(oldState, action)).toEqual([catalogRootLink]);
  });
});
