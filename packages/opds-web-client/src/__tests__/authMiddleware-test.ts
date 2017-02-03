import { expect } from "chai";
import { stub, spy } from "sinon";

import createAuthMiddleware from "../authMiddleware";
import * as ActionCreator from "../actions";
import DataFetcher from "../DataFetcher";

let hideAuthFormStub;
let clearAuthCredentialsStub;
let showAuthFormStub;

class MockActionCreator extends ActionCreator.default {
  hideAuthForm() {
    return hideAuthFormStub();
  }

  clearAuthCredentials() {
    return clearAuthCredentialsStub();
  }

  showAuthForm(callback, cancel, authProviders, title, error, attemptedProvider) {
    callback();
    return showAuthFormStub(callback, cancel, authProviders, title, error, attemptedProvider);
  }
}

describe("authMiddleware", () => {
  let actionCreatorStub;
  let next;
  let authMiddleware;
  let plugin;
  let pathFor;
  let store;
  let dataFetcher;

  beforeEach(() => {
    dataFetcher = new DataFetcher();
    dataFetcher.clearAuthCredentials();
    hideAuthFormStub = stub();
    clearAuthCredentialsStub = stub();
    showAuthFormStub = stub();
    actionCreatorStub = stub(ActionCreator, "default", MockActionCreator);
    next = stub().returns(new Promise((resolve, reject) => { resolve({}); }));

    store = {
      dispatch: stub().returns(new Promise((resolve, reject) => { resolve({}); })),
      getState: stub()
    };

    plugin = {
       type: "test",
       lookForCredentials: stub(),
       formComponent: null,
       buttonComponent: null
    };

    pathFor = stub();

    authMiddleware = createAuthMiddleware([plugin], pathFor);
  });

  afterEach(() => {
    actionCreatorStub.restore();
  });

  it("handles a plain action (not a thunk)", () => {
    let next = stub();
    authMiddleware(store)(next)({});
    expect(hideAuthFormStub.callCount).to.equal(1);
    expect(next.callCount).to.equal(2);
  });

  it("hides the auth form, calls the action, and does nothing else if it succeeds", (done) => {
    authMiddleware(store)(next)(() => {}).then(() => {
      expect(hideAuthFormStub.callCount).to.equal(1);
      expect(next.callCount).to.equal(2);
      done();
    }).catch(err => { console.log(err); throw(err); });
  });

  it("hides the auth form, calls the action, and hides the auth form again if the action returns a non-401 error", (done) => {
    next.onCall(1).returns(new Promise((resolve, reject) => { reject({status: 500}); }));
    authMiddleware(store)(next)(() => {}).then((arg) => {
      expect(hideAuthFormStub.callCount).to.equal(2);
      expect(next.callCount).to.equal(3);
      done();
    }).catch(err => { console.log(err); throw(err); });
  });

  it("hides the auth form, calls the action, and does nothing else if the error response wasn't json", (done) => {
    let error = {
      status: 401,
      response: "not json"
    };
    next.onCall(1).returns(new Promise((resolve, reject) => { reject(error); }));
    authMiddleware(store)(next)(() => {}).then(() => {
      expect(hideAuthFormStub.callCount).to.equal(1);
      expect(next.callCount).to.equal(2);
      done();
    }).catch(err => { console.log(err); throw(err); });
  });

  it("hides the auth form, calls the action, and does nothing else if the browser's default basic auth form was shown", (done) => {
    let error = {
      status: 401,
      response: JSON.stringify({ title: "error" }),
      headers: {
        "www-authenticate": "basic library card"
      }
    };
    next.onCall(1).returns(new Promise((resolve, reject) => { reject(error); }));
    authMiddleware(store)(next)(() => {}).then(() => {
      expect(hideAuthFormStub.callCount).to.equal(1);
      expect(next.callCount).to.equal(2);
      done();
    }).catch(err => { console.log(err); throw(err); });
  });

  it("clears existing credentials", (done) => {
    dataFetcher.setAuthCredentials({ provider: "test", credentials: "credentials" });
    store.getState.returns({ auth: {}, collection: {}, book: {} });
    let error = {
      status: 401,
      response: JSON.stringify({ title: "error" })
    };
    next.onCall(1).returns(new Promise((resolve, reject) => { reject(error); }));
    authMiddleware(store)(next)(() => {}).then(() => {
      expect(clearAuthCredentialsStub.callCount).to.equal(1);
      done();
    }).catch(err => { console.log(err); throw(err); });
  });

  it("shows auth form with provider info from failed request if there were no existing credentials", (done) => {
    store.getState.returns({ auth: {}, collection: {}, book: {} });
    let providers = {
      provider: {
        name: "a provider",
        methods: {
          test: "test method"
        }
      }
    };
    let error = {
      status: 401,
      response: JSON.stringify({ name: "Library", providers: providers })
    };
    next.onCall(1).returns(new Promise((resolve, reject) => { reject(error); }));
    authMiddleware(store)(next)(() => {}).then(() => {
      expect(showAuthFormStub.callCount).to.equal(1);
      expect(showAuthFormStub.args[0][2]).to.deep.equal([{
        name: "a provider",
        plugin: plugin,
        method: "test method"
      }]);
      expect(showAuthFormStub.args[0][3]).to.equal("Library");
      done();
    }).catch(err => { console.log(err); throw(err); });
  });

  it("shows auth form with provider info from store if existing credentials failed", (done) => {
    dataFetcher.setAuthCredentials({ provider: "test", credentials: "credentials" });
    let providers = [{
      name: "a provider",
      plugin: plugin,
      method: "test method"
    }];
    store.getState.returns({
      auth: {
        title: "Library",
        providers: providers
      },
      collection: {},
      book: {}
    });
    let error = {
      status: 401,
      response: JSON.stringify({ title: "error" })
    };
    next.onCall(1).returns(new Promise((resolve, reject) => { reject(error); }));
    authMiddleware(store)(next)(() => {}).then(() => {
      expect(showAuthFormStub.callCount).to.equal(1);
      expect(showAuthFormStub.args[0][2]).to.deep.equal([{
        name: "a provider",
        plugin: plugin,
        method: "test method"
      }]);
      expect(showAuthFormStub.args[0][3]).to.equal("Library");
      expect(showAuthFormStub.args[0][4]).to.equal("error");
      expect(showAuthFormStub.args[0][5]).to.equal("test");
      done();
    }).catch(err => { console.log(err); throw(err); });
  });

  it("retries action without credentials if existing credentials failed and there aren't providers in the store", (done) => {
    dataFetcher.setAuthCredentials({ provider: "test", credentials: "credentials" });
    store.getState.returns({ auth: { providers: null }, collection: {}, book: {} });
    let error = {
      status: 401,
      response: JSON.stringify({ title: "error" })
    };
    next.onCall(1).returns(new Promise((resolve, reject) => { reject(error); }));
    let action = stub();
    authMiddleware(store)(next)(action).then(() => {
      expect(showAuthFormStub.callCount).to.equal(0);
      expect(clearAuthCredentialsStub.callCount).to.equal(1);
      expect(store.dispatch.callCount).to.equal(2);
      expect(store.dispatch.args[1][0]).to.equal(action);
      done();
    }).catch(err => { console.log(err); throw(err); });
  });

  it("does not call showAuthForm if there's no supported auth method in the provider info", (done) => {
    store.getState.returns({ auth: {}, collection: {}, book: {} });
    let providers = {
      provider: {
        name: "a provider",
        methods: {
          unknownMethod: "unknown method"
        }
      }
    };
    let error = {
      status: 401,
      response: JSON.stringify({ name: "Library", providers: providers })
    };
    next.onCall(1).returns(new Promise((resolve, reject) => { reject(error); }));
    authMiddleware(store)(next)(() => {}).then(() => {
      expect(showAuthFormStub.callCount).to.equal(0);
      expect(hideAuthFormStub.callCount).to.equal(2);
      done();
    }).catch(err => { console.log(err); throw(err); });
  });

  it("makes cancel go to previous page if url has changed", (done) => {
    store.getState.returns({ auth: {}, collection: {url: "old"}, book: {} });
    pathFor.returns("new");
    let providers = {
      provider: {
        name: "a provider",
        methods: {
          test: "test method"
        }
      }
    };
    let error = {
      status: 401,
      response: JSON.stringify({ name: "Library", providers: providers })
    };
    next.onCall(1).returns(new Promise((resolve, reject) => { reject(error); }));
    authMiddleware(store)(next)(() => {}).then(() => {
      expect(showAuthFormStub.callCount).to.equal(1);
      let cancel = showAuthFormStub.args[0][1];
      let historySpy = spy(history, "back");
      cancel();
      historySpy.restore();
      expect(historySpy.callCount).to.equal(1);
      done();
    }).catch(err => { console.log(err); throw(err); });
  });

  it("makes cancel hide the form if url hasn't changed", (done) => {
    store.getState.returns({ auth: {}, collection: {}, book: {} });
    // blank is the value of window.location.pathname when running tests
    pathFor.returns("blank");
    let providers = {
      provider: {
        name: "a provider",
        methods: {
          test: "test method"
        }
      }
    };
    let error = {
      status: 401,
      response: JSON.stringify({ name: "Library", providers: providers })
    };
    next.onCall(1).returns(new Promise((resolve, reject) => { reject(error); }));
    authMiddleware(store)(next)(() => {}).then(() => {
      expect(showAuthFormStub.callCount).to.equal(1);
      expect(hideAuthFormStub.callCount).to.equal(1);
      let cancel = showAuthFormStub.args[0][1];
      cancel();
      expect(hideAuthFormStub.callCount).to.equal(2);
      done();
    }).catch(err => { console.log(err); throw(err); });
  });
});