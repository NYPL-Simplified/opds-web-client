import { createStore, combineReducers, applyMiddleware, Store } from "redux";
import reducers from "./reducers/index";
import collection from "./reducers/collection";
import { State } from "./state";
const thunk = require("redux-thunk").default;
import createAuthMiddleware from "./authMiddleware";
import AuthPlugin from "./AuthPlugin";
import { PathFor } from "./interfaces";

export default function buildStore(initialState?: State, authPlugins?: AuthPlugin[], pathFor?: PathFor): Store<State> {
  const middlewares = authPlugins && authPlugins.length ? [createAuthMiddleware(authPlugins, pathFor), thunk] : [thunk];
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