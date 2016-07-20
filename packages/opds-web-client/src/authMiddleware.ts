import DataFetcher from "./DataFetcher";
import ActionCreator from "./actions";
import { basicAuth } from "./auth";
import { BasicAuthCallback } from "./interfaces";

export default store => next => action => {
  if (typeof action === "function") {
    return new Promise((resolve, reject) => {
      let result = next(action);

      if (result.then) {
        result.then(resolve).catch(err => {
          if (err.status === 401) {
            let data = JSON.parse(err.response);
            let error = null;

            // clear any invalid credentials
            let usedBasicAuth = !!basicAuth.getCredentials();
            if (usedBasicAuth) {
              error = data.title;
              basicAuth.clearCredentials();
            }

            if (
              usedBasicAuth ||
              data.type.indexOf("http://opds-spec.org/auth/basic") !== -1
            ) {
              let callback: BasicAuthCallback = () => {
                // use dispatch() instead of next() to start from the top
                store.dispatch(action).then(blob => {
                  resolve(blob);
                }).catch(err => reject(err));
              };
              let fetcher = new DataFetcher({ auth: basicAuth });
              let actions = new ActionCreator(fetcher);

              next(actions.showBasicAuthForm(
                callback,
                data.labels,
                data.title,
                error
              ));
            }
          } else {
            reject(err);
          }
        });
      }
    });
  }

  next(action);
};