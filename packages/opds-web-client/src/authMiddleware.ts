import DataFetcher from "./DataFetcher";
import ActionCreator from "./actions";
import { BasicAuthCallback } from "./interfaces";

export default store => next => action => {
  if (typeof action === "function") {
    return new Promise((resolve, reject) => {
      let result = next(action);

      if (result && result.then) {
        result.then(resolve).catch(err => {
          if (err.status === 401) {
            let fetcher = new DataFetcher();
            let actions = new ActionCreator(fetcher);
            let data = JSON.parse(err.response);
            let error = null;

            // clear any invalid credentials
            let usedBasicAuth = !!fetcher.getBasicAuthCredentials();
            if (usedBasicAuth) {
              error = data.title;
              store.dispatch(actions.clearBasicAuthCredentials());
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