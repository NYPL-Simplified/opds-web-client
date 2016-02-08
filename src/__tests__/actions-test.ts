import * as thunk from "redux-thunk";
import {
  FETCH_COLLECTION_REQUEST,
  FETCH_COLLECTION_SUCCESS,
  LOAD_COLLECTION,
  fetchCollection
} from "../actions";
import * as nock from "nock";

describe("actions", () => {
  describe("fetchCollection", () => {
    it("creates FETCH_COLLECTION_SUCCESS and LOAD_COLLECTION when fetching is done", () => {
      nock("http://example.com")
        .get("/feed")
        .reply(200, "<feed></feed>");
    });
  });
});