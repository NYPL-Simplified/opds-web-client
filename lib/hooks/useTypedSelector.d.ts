import { TypedUseSelectorHook } from "react-redux";
import { State } from "../state";
/**
 * This creates a type-safe hook based on Redux's useSelector to be
 * able to easily get the needed data from the store.
 */
declare const useTypedSelector: TypedUseSelectorHook<State>;
export default useTypedSelector;
