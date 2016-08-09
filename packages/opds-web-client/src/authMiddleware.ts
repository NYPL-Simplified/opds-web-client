import DataFetcher from "./DataFetcher";
import ActionCreator from "./actions";
import { BasicAuthCallback } from "./interfaces";

// see Redux Middleware docs:
// http://redux.js.org/docs/advanced/Middleware.html

const BASIC_AUTH = "http://opds-spec.org/auth/basic";

export default store => next => action => {
  let fetcher = new DataFetcher();
  let actions = new ActionCreator(fetcher);

  if (typeof action === "function") {
    return new Promise((resolve, reject) => {
      next(actions.hideBasicAuthForm());
      let result = next(action);

      if (result && result.then) {
        result.then(resolve).catch(err => {
          if (err.status === 401) {
            let data = JSON.parse(err.response);
            let error = null;

            if (err.headers && err.headers.has("www-authenticate")) {
              // browser's default basic auth form was shown,
              // so don't show ours
              reject(err);
            } else {
              // clear any invalid credentials
              let usedBasicAuth = !!fetcher.getBasicAuthCredentials();
              if (usedBasicAuth) {
                // 401s resulting from wrong username/password return
                // problem detail documents, not auth documents
                error = data.title;
                store.dispatch(actions.clearBasicAuthCredentials());
              }

              // find provider with basic auth method
              let provider = Object.keys(data.providers).find(key => {
                return Object.keys(data.providers[key].methods).indexOf(BASIC_AUTH) !== -1;
              });

              if (
                usedBasicAuth ||
                provider
              ) {
                let callback: BasicAuthCallback = () => {
                  // use dispatch() instead of next() to start from the top
                  store.dispatch(action).then(blob => {
                    resolve(blob);
                  }).catch(reject);
                };

                let title, labels;

                // if previous basic auth failed, we have to get title and
                // labels from store, instead of response data
                if (usedBasicAuth) {
                  let state = store.getState();
                  title = state.auth.title;
                  labels = {
                    login: state.auth.loginLabel,
                    password: state.auth.passwordLabel
                  };
                } else {
                  title = data.name;
                  labels = data.providers[provider].methods[BASIC_AUTH].labels;
                }

                next(actions.closeError());
                next(actions.showBasicAuthForm(
                  callback,
                  labels,
                  title,
                  error
                ));
              }
            }
          } else {
            next(actions.hideBasicAuthForm());
            reject(err);
          }
        });
      }
    });
  }

  next(actions.hideBasicAuthForm());
  next(action);
};