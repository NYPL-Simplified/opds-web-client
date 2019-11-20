import { expect } from "chai";
import { stub } from "sinon";

import reducer from "../preferences";
import DataFetcher from "../../DataFetcher";
import ActionCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";

let fetcher = new DataFetcher({ adapter });
let actions = new ActionCreator(fetcher);

describe("preferences reducer", () => {
  let initState = {};

  it("returns the initial state", () => {
    expect(reducer(undefined, {})).to.deep.equal(initState);
  });

  it("handles SET_PREFERENCE", () => {
    let action = actions.setPreference("key", "value");
    let newState = { ...initState, key: "value" };
    expect(reducer(initState, action)).to.deep.equal(newState);
  });
});
