import { combineReducers } from "redux";
import collection from "./collection";
import book from "./book";
import auth from "./auth";
import { State } from "../state";

const reducers = combineReducers<State>({
  collection,
  book,
  auth
});

export default reducers;