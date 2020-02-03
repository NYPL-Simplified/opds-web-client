import { TypedUseSelectorHook, useSelector } from "react-redux";
import { State } from "../state";

/**
 * This creates a type-safe hook based on Redux's useSelector to be
 * able to easily get the needed data from the store.
 */
const useTypedSelector: TypedUseSelectorHook<State> = useSelector;

export default useTypedSelector;
