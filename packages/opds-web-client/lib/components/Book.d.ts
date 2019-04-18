import * as React from "react";
import { BookData } from "../interfaces";
export interface BookProps {
    book: BookData;
    collectionUrl?: string;
    updateBook: (url: string) => Promise<BookData>;
    fulfillBook: (url: string) => Promise<Blob>;
    indirectFulfillBook: (url: string, type: string) => Promise<string>;
    isSignedIn?: boolean;
    epubReaderUrlTemplate?: (epubUrl: string) => string;
}
/** Displays a single book for use in a lane, list, or grid view. */
export default class Book<P extends BookProps> extends React.Component<P, {}> {
    constructor(props: any);
    render(): JSX.Element;
    fields(): {
        name: string;
        value: string;
    }[];
    circulationLinks(): any[];
    getMedium(book: any): any;
    getMediumSVG(medium: any, displayLabel?: boolean): JSX.Element;
    borrow(): Promise<BookData>;
    isReserved(): boolean;
    isReady(): boolean;
    isBorrowed(): boolean;
    isOpenAccess(): boolean;
}
