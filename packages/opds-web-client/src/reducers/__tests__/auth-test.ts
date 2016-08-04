jest.dontMock("../auth");
jest.dontMock("../../actions");

import reducer from "../auth";
import DataFetcher from "../../DataFetcher";
import ActionsCreator from "../../actions";
import { adapter } from "../../OPDSDataAdapter";

let fetcher = new DataFetcher({ adapter });
let actions = new ActionsCreator(fetcher);

describe("auth reducer", () => {
  let initState = {
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

  it("returns the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initState);
  });

  it("handles SHOW_BASIC_AUTH_FORM", () => {
    let callback = jest.genMockFunction();
    let labels = { login: "barcode", password: "pin" };
    let action = actions.showBasicAuthForm(callback, labels, "library");
    let newState = Object.assign({}, initState, {
      basic: Object.assign({}, initState.basic, {
        showForm: true,
        callback: callback,
        title: "library",
        loginLabel: "barcode",
        passwordLabel: "pin"
      })
    });

    expect(reducer(initState, action)).toEqual(newState);
  });

  it("handles HIDE_BASIC_AUTH_FORM", () => {
    let oldState = Object.assign({}, initState, {
      basic: Object.assign({}, initState.basic, {
        showForm: true,
        error: "test error"
      })
    });
    let action = actions.hideBasicAuthForm();
    let newState = Object.assign({}, oldState, {
      basic: Object.assign({}, oldState.basic, {
        showForm: false,
        error: null
      })
    });

    expect(reducer(oldState, action)).toEqual(newState);
  });

  it("handles SAVE_BASIC_AUTH_CREDENTIALS", () => {
    let action = actions.saveBasicAuthCredentials("credentials");
    let newState = Object.assign({}, initState, {
      basic: Object.assign({}, initState.basic, {
        credentials: "credentials"
      })
    });

    expect(reducer(initState, action)).toEqual(newState);
  });
});