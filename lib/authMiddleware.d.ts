import AuthPlugin from "./AuthPlugin";
import { AuthMethod, PathFor } from "./interfaces";
declare const _default: (authPlugins: AuthPlugin<AuthMethod>[], pathFor?: PathFor | undefined) => (store: any) => (next: any) => (action: any) => Promise<unknown> | undefined;
/** Redux middleware for handling requests that require authentication.
    Intercepts 401 errors and shows an authentication form, then retries the
    original request after the user authenticates.
    See Redux Middleware docs:
    http://redux.js.org/docs/advanced/Middleware.html */
export default _default;
