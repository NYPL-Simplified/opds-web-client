import ActionCreator from "../actions";

export interface PreferencesState {
  [key: string]: string;
}

const initialState: PreferencesState = {};

export default (
  state: PreferencesState = initialState,
  action
): PreferencesState => {
  switch (action.type) {
    case ActionCreator.SET_PREFERENCE:
      const change = {};
      change[action.key] = action.value;
      return { ...state, ...change };

    default:
      return state;
  }
};
