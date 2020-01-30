import { TypedUseSelectorHook, useSelector } from "react-redux";
import { State } from "../state";

const useTypedSelector: TypedUseSelectorHook<State> = useSelector;

export default useTypedSelector;
