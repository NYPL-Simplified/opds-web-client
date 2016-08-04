import { combineReducers } from "redux";
import collection from "./collection";
import book from "./book";
import auth from "./auth";
import loans from "./loans";
import { State } from "../state";

const reducers = combineReducers<State>({
  collection,
  book,
  loans,
  auth
});

export default reducers;