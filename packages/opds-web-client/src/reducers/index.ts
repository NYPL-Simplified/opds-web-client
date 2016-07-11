import * as Redux from "redux";
import collection from "./collection";
import book from "./book";
import { State } from "../state";

const reducers = Redux.combineReducers<State>({
  collection,
  book
});

export default reducers;