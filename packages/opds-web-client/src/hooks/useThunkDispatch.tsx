import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../state";
import { Action } from "redux";

/**
 * Custom hook to use react-redux dispatch typed properly for redux thunk
 *  - note that actions are currently typed as any, as they are not strongly
 * typed in OPDS-web-client
 */
export type ReduxDispatch = ThunkDispatch<State, undefined, Action>;
const useThunkDispatch = (): ReduxDispatch => {
  return useDispatch<ReduxDispatch>();
};

export default useThunkDispatch;
