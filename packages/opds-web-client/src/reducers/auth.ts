import { AuthCallback, AuthData } from "../interfaces";

export interface AuthState extends AuthData {};

const initialState: AuthState = {
  showForm: false,
  callback: null,
  cancel: null,
  credentials: null,
  title: null,
  error: null,
  providers: []
};

export default (state: AuthState = initialState, action): AuthState => {
  switch (action.type) {
    case "SHOW_AUTH_FORM":
      return Object.assign({}, state, {
        showForm: true,
        callback: action.callback,
        cancel: action.cancel,
        title: action.error ? state.title : action.title,
        error: action.error || null,
        providers: action.providers
      });

    case "HIDE_AUTH_FORM":
      return Object.assign({}, state, {
        showForm: false,
        error: null
      });

    case "SAVE_AUTH_CREDENTIALS":
      return Object.assign({}, state, {
        credentials: action.credentials
      });

    case "CLEAR_AUTH_CREDENTIALS":
      return Object.assign({}, state, {
        credentials: null
      });

    default:
      return state;
  }
};