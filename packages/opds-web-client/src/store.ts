import { createStore, combineReducers, applyMiddleware } from "redux";
import * as thunk from "redux-thunk";
import reducers from "./reducers/index";

export default function buildStore(initialState?: any) {
  return createStore(
    combineReducers({ catalog: reducers }),
    initialState,
    applyMiddleware(thunk)
  );
}