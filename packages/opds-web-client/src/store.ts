import { createStore, combineReducers, applyMiddleware } from "redux";
import reducers from "./reducers/index";
const thunk = require("redux-thunk").default;

export default function buildStore(initialState?: any) {
  return createStore(
    combineReducers({ catalog: reducers }),
    initialState,
    applyMiddleware(thunk)
  );
}