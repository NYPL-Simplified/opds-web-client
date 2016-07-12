import { combineReducers } from "redux";
import collection from "./collection";
import book from "./book";
import { State } from "../state";

const reducers = combineReducers<State>({
  collection,
  book
});

export default reducers;