import { createStore, combineReducers, applyMiddleware, Store } from "redux";
import reducers from "./reducers/index";
import collection from "./reducers/collection";
import { State } from "./state";
const thunk = require("redux-thunk").default;
import authMiddleware from "./authMiddleware";

export default function buildStore(initialState?: State, withAuth: boolean = true): Store<State> {
  const middlewares = withAuth ? [authMiddleware, thunk] : [thunk];
  return createStore<State>(
    reducers,
    initialState,
    applyMiddleware(...middlewares)
  );
}

export function buildCollectionStore(initialState?): Store<any> {
  return createStore<any>(
    combineReducers({ collection }),
    initialState,
    applyMiddleware(thunk)
  );
}