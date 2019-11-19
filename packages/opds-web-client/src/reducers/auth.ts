import { AuthData } from "../interfaces";
import ActionCreator from "../actions";

export interface AuthState extends AuthData {}

const initialState: AuthState = {
  showForm: false,
  callback: null,
  cancel: null,
  credentials: null,
  title: null,
  error: null,
  attemptedProvider: null,
  providers: null
};

export default (state: AuthState = initialState, action): AuthState => {
  switch (action.type) {
    case ActionCreator.SHOW_AUTH_FORM:
      return {
        ...state,
        showForm: true,
        callback: action.callback,
        cancel: action.cancel,
        title: action.error ? state.title : action.title,
        error: action.error || null,
        attemptedProvider: action.attemptedProvider || null,
        providers: action.providers
      };

    case ActionCreator.HIDE_AUTH_FORM:
      return {
        ...state,
        showForm: false,
        error: null
      };

    case ActionCreator.SAVE_AUTH_CREDENTIALS:
      return { ...state, credentials: action.credentials };

    case ActionCreator.CLEAR_AUTH_CREDENTIALS:
      return { ...state, credentials: null };

    default:
      return state;
  }
};
