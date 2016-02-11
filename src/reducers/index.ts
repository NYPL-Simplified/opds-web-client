import { combineReducers } from "redux";
import collection from "./collection";
import book from "./book";

const reducers = combineReducers({
  collection,
  book
});

export default reducers;