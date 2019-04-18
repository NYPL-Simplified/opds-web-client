import * as React from "react";
import { CollectionData, LinkData } from "../interfaces";
export interface BreadcrumbsProps extends React.Props<{}> {
    links: LinkData[];
    currentLink?: boolean;
}
export interface ComputeBreadcrumbs {
    (collection: CollectionData, history: LinkData[]): LinkData[];
}
/** Shows a list of breadcrumbs links above a collection. */
export default class Breadcrumbs extends React.Component<BreadcrumbsProps, {}> {
    static defaultProps: Partial<BreadcrumbsProps>;
    render(): JSX.Element;
}
/** Computes breadcrumbs based on the browser history, with the current collection as the
    final element. */
export declare function defaultComputeBreadcrumbs(collection: CollectionData, history: LinkData[]): LinkData[];
/** Computes breadcrumbs assuming that the OPDS feed is hierarchical - uses the catalog root
    link, the parent of the current collection if it's not the root, and the current collection.
    The OPDS spec doesn't require a hierarchy, so this may not make sense for some feeds. */
export declare function hierarchyComputeBreadcrumbs(collection: CollectionData, history: LinkData[], comparator?: (url1: string, url2: string) => boolean): LinkData[];
