const Cookie = require("js-cookie");

export interface AuthMethod {
  setCredentials: (credentials: string) => void;
  getCredentials: () => string;
  clearCredentials: () => void;
  prepareHeaders: (headers: any) => any;
}

export const basicAuth: AuthMethod = {
  setCredentials(credentials: string) {
    if (credentials) {
      Cookie.set("basicAuthCredentials", credentials);
    }
  },

  getCredentials(): string {
    return Cookie.get("basicAuthCredentials");
  },

  clearCredentials(): void {
    Object.keys(Cookie.get()).forEach(key => Cookie.remove(key));
  },

  prepareHeaders(headers: any = {}): any {
    // server needs to know request came from JS in order to omit
    // 'Www-Authenticate: Basic' header, which triggers browser's
    // ugly basic auth popup
    headers["X-Requested-With"] = "XMLHttpRequest";

    if (this.getCredentials()) {
      headers["Authorization"] = "Basic " + this.getCredentials();
    }

    return headers;
  }
};