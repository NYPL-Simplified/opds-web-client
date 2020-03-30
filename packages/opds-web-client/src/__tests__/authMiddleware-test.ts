import { expect } from "chai";
import { stub, spy } from "sinon";

import createAuthMiddleware from "../authMiddleware";
import ActionCreator from "../actions";
import DataFetcher from "../DataFetcher";

let hideAuthFormStub;
let clearAuthCredentialsStub;
let showAuthFormStub;

describe("authMiddleware", () => {
  let next;
  let authMiddleware;
  let plugin;
  let pathFor;
  let store;
  let dataFetcher;

  beforeEach(() => {
    dataFetcher = new DataFetcher();
    dataFetcher.clearAuthCredentials();
    showAuthFormStub = stub(ActionCreator.prototype, "showAuthForm").callsArg(
      0
    );
    hideAuthFormStub = stub(
      ActionCreator.prototype,
      "hideAuthForm"
    ).callsFake(() => ({ type: "" }));
    clearAuthCredentialsStub = stub(
      DataFetcher.prototype,
      "clearAuthCredentials"
    ).callsFake(() => {});
    next = stub().returns(
      new Promise(resolve => {
        resolve({});
      })
    );

    store = {
      dispatch: stub().returns(
        new Promise(resolve => {
          resolve({});
        })
      ),
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
    showAuthFormStub.restore();
    hideAuthFormStub.restore();
    clearAuthCredentialsStub.restore();
  });

  it("handles a plain action (not a thunk)", () => {
    let next = stub();
    authMiddleware(store)(next)({});
    expect(hideAuthFormStub.callCount).to.equal(1);
    expect(next.callCount).to.equal(2);
  });

  it("hides the auth form, calls the action, and does nothing else if it succeeds", async () => {
    await authMiddleware(store)(next)(() => {})
      .then(() => {
        expect(hideAuthFormStub.callCount).to.equal(1);
        expect(next.callCount).to.equal(2);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });

  it("hides the auth form, calls the action, and hides the auth form again if the action returns a non-401 error", async () => {
    next.onCall(1).returns(
      new Promise((resolve, reject) => {
        reject({ status: 500 });
      })
    );
    await authMiddleware(store)(next)(() => {})
      .then(() => {
        expect(hideAuthFormStub.callCount).to.equal(2);
        expect(next.callCount).to.equal(3);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });

  it("hides the auth form, calls the action, and does nothing else if the error response wasn't json", async () => {
    let error = {
      status: 401,
      response: "not json"
    };
    next.onCall(1).returns(
      new Promise((resolve, reject) => {
        reject(error);
      })
    );
    await authMiddleware(store)(next)(() => {})
      .then(() => {
        expect(hideAuthFormStub.callCount).to.equal(1);
        expect(next.callCount).to.equal(2);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });

  it("hides the auth form, calls the action, and does nothing else if the browser's default basic auth form was shown", async () => {
    let error = {
      status: 401,
      response: JSON.stringify({ title: "error" }),
      headers: {
        "www-authenticate": "basic library card"
      }
    };
    next.onCall(1).returns(
      new Promise((resolve, reject) => {
        reject(error);
      })
    );
    await authMiddleware(store)(next)(() => {})
      .then(() => {
        expect(hideAuthFormStub.callCount).to.equal(1);
        expect(next.callCount).to.equal(2);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });

  it("clears existing credentials", async () => {
    dataFetcher.setAuthCredentials({
      provider: "test",
      credentials: "credentials"
    });
    store.getState.returns({ auth: {}, collection: {}, book: {} });
    let error = {
      status: 401,
      response: JSON.stringify({ title: "error" })
    };
    next.onCall(1).returns(
      new Promise((resolve, reject) => {
        reject(error);
      })
    );
    await authMiddleware(store)(next)(() => {})
      .then(() => {
        expect(clearAuthCredentialsStub.callCount).to.equal(1);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });

  it("shows auth form with provider info from failed request if there were no existing credentials", async () => {
    store.getState.returns({ auth: {}, collection: {}, book: {} });
    let authentication = [{ type: "test", id: "a provider" }];
    let error = {
      status: 401,
      response: JSON.stringify({ title: "Library", authentication })
    };
    next.onCall(1).returns(
      new Promise((resolve, reject) => {
        reject(error);
      })
    );
    await authMiddleware(store)(next)(() => {})
      .then(() => {
        expect(showAuthFormStub.callCount).to.equal(1);
        expect(showAuthFormStub.args[0][2]).to.deep.equal([
          {
            id: "a provider",
            plugin: plugin,
            method: authentication[0]
          }
        ]);
        expect(showAuthFormStub.args[0][3]).to.equal("Library");
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });

  it("shows auth form with provider info from store if existing credentials failed", async () => {
    dataFetcher.setAuthCredentials({
      provider: "test",
      credentials: "credentials"
    });
    let providers = [
      {
        id: "a provider",
        plugin: plugin,
        method: "test method"
      }
    ];
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

    next.onCall(1).returns(
      new Promise((resolve, reject) => {
        reject(error);
      })
    );
    await authMiddleware(store)(next)(() => {})
      .then(() => {
        expect(showAuthFormStub.callCount).to.equal(1);
        expect(showAuthFormStub.args[0][2]).to.deep.equal([
          {
            id: "a provider",
            plugin: plugin,
            method: "test method"
          }
        ]);
        expect(showAuthFormStub.args[0][3]).to.equal("Library");
        expect(showAuthFormStub.args[0][4]).to.equal("error");
        expect(showAuthFormStub.args[0][5]).to.equal("test");
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });

  it("retries action without credentials if existing credentials failed and there aren't providers in the store", async () => {
    dataFetcher.setAuthCredentials({
      provider: "test",
      credentials: "credentials"
    });
    store.getState.returns({
      auth: { providers: null },
      collection: {},
      book: {}
    });
    let error = {
      status: 401,
      response: JSON.stringify({ title: "error" })
    };
    next.onCall(1).returns(
      new Promise((resolve, reject) => {
        reject(error);
      })
    );
    let action = stub();
    await authMiddleware(store)(next)(action)
      .then(() => {
        expect(showAuthFormStub.callCount).to.equal(0);
        expect(clearAuthCredentialsStub.callCount).to.equal(1);
        expect(store.dispatch.callCount).to.equal(2);
        expect(store.dispatch.args[1][0]).to.equal(action);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });

  it("does not call showAuthForm if there's no supported auth method in the auth document", async () => {
    store.getState.returns({ auth: {}, collection: {}, book: {} });
    let authentication = [{ type: "unknown method", id: "a provider" }];
    let error = {
      status: 401,
      response: JSON.stringify({ title: "Library", authentication })
    };
    next.onCall(1).returns(
      new Promise((resolve, reject) => {
        reject(error);
      })
    );
    await authMiddleware(store)(next)(() => {})
      .then(() => {
        expect(showAuthFormStub.callCount).to.equal(0);
        expect(hideAuthFormStub.callCount).to.equal(2);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });

  it("makes cancel go to previous page if url has changed", async () => {
    store.getState.returns({ auth: {}, collection: { url: "old" }, book: {} });
    pathFor.returns("new");
    let authentication = [{ type: "test", id: "a provider" }];
    let error = {
      status: 401,
      response: JSON.stringify({ title: "Library", authentication })
    };
    next.onCall(1).returns(
      new Promise((resolve, reject) => {
        reject(error);
      })
    );
    await authMiddleware(store)(next)(() => {})
      .then(() => {
        expect(showAuthFormStub.callCount).to.equal(1);
        let cancel = showAuthFormStub.args[0][1];
        let historySpy = spy(history, "back");
        cancel();
        historySpy.restore();
        expect(historySpy.callCount).to.equal(1);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });

  it("makes cancel hide the form if url hasn't changed", async () => {
    store.getState.returns({ auth: {}, collection: {}, book: {} });
    // "/" is the value of window.location.pathname when running tests
    pathFor.returns("/");
    let authentication = [{ type: "test", id: "a provider" }];
    let error = {
      status: 401,
      response: JSON.stringify({ name: "Library", authentication })
    };
    next.onCall(1).returns(
      new Promise((resolve, reject) => {
        reject(error);
      })
    );
    await authMiddleware(store)(next)(() => {})
      .then(() => {
        expect(showAuthFormStub.callCount).to.equal(1);
        expect(hideAuthFormStub.callCount).to.equal(1);
        let cancel = showAuthFormStub.args[0][1];
        cancel();
        expect(hideAuthFormStub.callCount).to.equal(2);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });
});
