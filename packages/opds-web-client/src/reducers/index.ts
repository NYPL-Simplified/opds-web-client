import * as Redux from "redux";
import collection, { CollectionState } from "./collection";
import book, { BookState } from "./book";

export interface State {
  collection: CollectionState;
  book: BookState;
}

const reducers = Redux.combineReducers<State>({
  collection,
  book
});

export default reducers;