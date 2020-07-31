import * as React from "react";
import { Router as RouterType } from "../../interfaces";
/**
 * This component will pass the router down the tree
 * via both old and new context apis. Currently, OPDS web
 * gets this context from react-router's Router, but that
 * context goes away in RR v4+. This makes it possible for
 * circulation-patron-web to use RR v4+ while maintaining
 * compatibility with current opds-web.
 */
export declare const RouterContext: React.Context<RouterType | undefined>;
declare type RouterContextProps = {
    router: RouterType;
};
export default class RouterProvider extends React.Component<RouterContextProps> {
    static childContextTypes: React.ValidationMap<{}>;
    getChildContext(): {
        router: RouterType;
    };
    render(): JSX.Element;
}
export {};
