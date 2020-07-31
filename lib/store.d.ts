import { Store } from "redux";
import { State } from "./state";
import AuthPlugin from "./AuthPlugin";
import { PathFor } from "./interfaces";
/** Builds the Redux store. If any auth plugins are passed in, it will add auth middleware.
    If localStorage is available, it will persist the preferences state only. */
export default function buildStore(initialState?: State, authPlugins?: AuthPlugin[], pathFor?: PathFor): Store<State>;
