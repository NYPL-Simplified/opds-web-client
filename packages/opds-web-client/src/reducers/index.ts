import { combineReducers } from "redux";
import collection from "./collection";
import book from "./book";
import auth from "./auth";
import loans from "./loans";
import preferences from "./preferences";
import { State } from "../state";

const reducers: any = combineReducers<State>({
  collection,
  book,
  loans,
  auth,
  preferences
});

export default reducers;