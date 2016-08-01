import { BasicAuthCallback, BasicAuthData } from "../interfaces";

export interface AuthState {
  basic: BasicAuthData;
}

const initialState: AuthState = {
  basic: {
    showForm: false,
    callback: null,
    credentials: null,
    title: null,
    loginLabel: null,
    passwordLabel: null,
    error: null
  }
};

export default (state: AuthState = initialState, action): AuthState => {
  switch (action.type) {
    case "SHOW_BASIC_AUTH_FORM":
      return Object.assign({}, state, {
        basic: Object.assign({}, state.basic, {
          showForm: true,
          callback: action.callback,
          title: action.error ? state.basic.title : action.title,
          loginLabel: action.labels && action.labels.login ?
                      action.labels.login :
                      state.basic.loginLabel,
          passwordLabel: action.labels && action.labels.password ?
                         action.labels.password :
                         state.basic.passwordLabel,
          error: action.error || null
        })
      });

    case "HIDE_BASIC_AUTH_FORM":
      return Object.assign({}, state, {
        basic: Object.assign({}, state.basic, {
          showForm: false,
          error: null
        })
      });

    case "SAVE_BASIC_AUTH_CREDENTIALS":
      return Object.assign({}, state, {
        basic: Object.assign({}, state.basic, {
          credentials: action.credentials
        })
      });

    case "CLEAR_BASIC_AUTH_CREDENTIALS":
      return Object.assign({}, state, {
        basic: Object.assign({}, state.basic, {
          credentials: null
        })
      });

    default:
      return state;
  }
};