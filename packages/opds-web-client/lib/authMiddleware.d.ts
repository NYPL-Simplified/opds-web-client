import AuthPlugin from "./AuthPlugin";
import { PathFor } from "./interfaces";
declare const _default: (authPlugins: AuthPlugin[], pathFor: PathFor) => (store: any) => (next: any) => (action: any) => Promise<void | {}>;
export default _default;
