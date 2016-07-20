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
    isFetching: false,
    error: null
  }
};

const auth = (state: AuthState = initialState, action): AuthState => {
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
          error: action.error
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

    case "BORROW_BOOK_REQUEST":
      return Object.assign({}, state, {
        isFetching: true
      });

    case "BORROW_BOOK_SUCCESS":
      return Object.assign({}, state, {
        isFetching: false
      });

    case "BORROW_BOOK_FAILURE":
      return Object.assign({}, state, {
        isFetching: false
      });

    default:
      return state;
  }
};

export default auth;