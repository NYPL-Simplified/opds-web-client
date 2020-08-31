import * as React from "react";
import { CollectionData, FetchErrorData, BookData } from "../interfaces";
export interface CollectionProps extends React.HTMLProps<Collection> {
    collection: CollectionData;
    isFetchingCollection?: boolean;
    isFetchingBook?: boolean;
    isFetchingPage?: boolean;
    error?: FetchErrorData;
    fetchPage?: (url: string) => Promise<any>;
    updateBook: (url: string) => Promise<BookData>;
    fulfillBook: (url: string) => Promise<Blob>;
    indirectFulfillBook: (url: string, type: string) => Promise<string>;
    isSignedIn?: boolean;
    epubReaderUrlTemplate?: (epubUrl: string) => string;
    preferences?: {
        [key: string]: string;
    };
    setPreference: (key: string, value: string) => void;
}
/** Displays books in an OPDS collection as either lanes, a grid or a list. */
export default class Collection extends React.Component<CollectionProps, {}> {
    static VIEW_KEY: string;
    static GRID_VIEW: string;
    static LIST_VIEW: string;
    constructor(props: any);
    render(): JSX.Element;
    getSelectedView(): string;
    selectGridView(): void;
    selectListView(): void;
    componentWillReceiveProps(nextProps: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    canFetch(): boolean;
    fetch(): void;
    handleScrollOrResize(): void;
    isEmpty(): boolean;
}
