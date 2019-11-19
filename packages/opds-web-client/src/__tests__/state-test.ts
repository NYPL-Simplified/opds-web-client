import { expect } from "chai";
import { stub } from "sinon";

let dispatch = () => {};
let initialState = "initial state";
let alteredState = "state with collection and book";
let testState = initialState;
import * as mergeRootProps from "../components/mergeRootProps";
import * as store from "../store";

import buildInitialState from "../state";

describe("buildInitialState", () => {
  let collectionUrl = "collection url";
  let bookUrl = "book url";
  let fetchCollectionAndBookStub;
  let createFetchCollectionAndBookStub;
  let storeStub;

  beforeEach(() => {
    fetchCollectionAndBookStub = stub().returns(
      new Promise((resolve, reject) => {
        testState = alteredState;
        resolve({ collectionData: null, bookData: null });
      })
    );
    createFetchCollectionAndBookStub = stub(
      mergeRootProps,
      "createFetchCollectionAndBook"
    ).returns(fetchCollectionAndBookStub);

    storeStub = stub(store, "default").returns({
      dispatch,
      getState: () => testState
    });
  });

  afterEach(() => {
    createFetchCollectionAndBookStub.restore();
    storeStub.restore();
  });

  it("fetches given collection and book into state", done => {
    buildInitialState(collectionUrl, bookUrl)
      .then(state => {
        expect(createFetchCollectionAndBookStub.callCount).to.equal(1);
        expect(createFetchCollectionAndBookStub.args[0][0]).to.equal(dispatch);
        expect(fetchCollectionAndBookStub.callCount).to.equal(1);
        expect(fetchCollectionAndBookStub.args[0][0]).to.equal(collectionUrl);
        expect(fetchCollectionAndBookStub.args[0][1]).to.equal(bookUrl);
        expect(state).to.equal(alteredState);
        done();
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });
});
