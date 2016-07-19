import DataFetcher from "./DataFetcher";
import ActionCreator from "./actions";
import { basicAuth } from "./auth";
import { BasicAuthCallback } from "./interfaces";

export default store => next => action => {
  if (typeof action === "function") {
    return new Promise((resolve, reject) => {
      next(action).then(resolve).catch(err => {
        if (err.status === 401) {
          let data = JSON.parse(err.response);

          if (data.type.indexOf("http://opds-spec.org/auth/basic") !== -1) {
            let callback: BasicAuthCallback = () => {
              next(action).then(blob => {
                resolve(blob);
              }).catch(err => reject(err));
            };
            let fetcher = new DataFetcher({ auth: basicAuth });
            let actions = new ActionCreator(fetcher);
            next(actions.showBasicAuthForm(callback, data.labels, data.title));
          }
        } else {
          reject(err);
        }
      });
    });
  }

  next(action);
};