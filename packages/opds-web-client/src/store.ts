import { compose, createStore, combineReducers, applyMiddleware, Store } from "redux";
import reducers from "./reducers/index";
import collection from "./reducers/collection";
import { State } from "./state";
const thunk = require("redux-thunk").default;
import createAuthMiddleware from "./authMiddleware";
import AuthPlugin from "./AuthPlugin";
import { PathFor } from "./interfaces";
let persistState = null;
try {
  const testKey = String(Math.random());
  window.localStorage.setItem(testKey, "test");
  window.localStorage.removeItem(testKey);
  persistState = require("redux-localstorage");
} catch (e) {
  // localStorage isn't available in this environment, so preferences won't be saved.
}

export default function buildStore(initialState?: State, authPlugins?: AuthPlugin[], pathFor?: PathFor): Store<State> {
  const middlewares = authPlugins && authPlugins.length ? [createAuthMiddleware(authPlugins, pathFor), thunk] : [thunk];
  const composeArgs = [applyMiddleware(...middlewares)];
  if (persistState) {
    composeArgs.push(persistState("preferences"));
  }
  return createStore<State>(
    reducers,
    initialState,
    compose.apply(this, composeArgs)
  );
}
