import * as React from "react";
import { PathFor } from "../../interfaces";
/**
 * This is a component that will pass the pathFor prop down the tree
 * via both old and new context apis.
 */
export declare const PathForContext: React.Context<PathFor | undefined>;
declare type PathForProps = {
    pathFor: PathFor;
    children: React.ReactChild;
};
export default class PathForProvider extends React.Component<PathForProps> {
    static childContextTypes: React.ValidationMap<{}>;
    getChildContext(): {
        pathFor: PathFor;
    };
    render(): JSX.Element;
}
export declare function usePathFor(): PathFor;
export {};
