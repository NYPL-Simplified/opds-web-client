import * as React from "react";
import { Store } from "redux";
import { CollectionData, LaneData, BookData } from "../interfaces";
export interface LanesProps {
    url: string;
    lanes?: LaneData[];
    fetchCollection?: (url: string) => Promise<CollectionData>;
    clearCollection?: () => void;
    store?: Store<{
        collection: CollectionData;
    }>;
    namespace?: string;
    proxyUrl?: string;
    hiddenBookIds?: string[];
    hideMoreLinks?: boolean;
    isFetching?: boolean;
    updateBook: (url: string) => Promise<BookData>;
    isSignedIn?: boolean;
    epubReaderUrlTemplate?: (epubUrl: string) => string;
}
/** All the lanes for a collection. */
export declare class Lanes extends React.Component<LanesProps, {}> {
    render(): JSX.Element;
    componentWillMount(): void;
    componentWillReceiveProps(newProps: any): void;
    componentWillUnmount(): void;
}
declare const ConnectedLanes: any;
export default ConnectedLanes;
