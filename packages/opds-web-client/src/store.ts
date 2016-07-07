import { createStore, combineReducers, applyMiddleware, Store } from "redux";
import reducers, { State } from "./reducers/index";
const thunk = require("redux-thunk").default;

export default function buildStore(initialState?: State): Store<State> {
  return createStore<State>(
    combineReducers<State>({ catalog: reducers }),
    initialState,
    applyMiddleware(thunk)
  );
}