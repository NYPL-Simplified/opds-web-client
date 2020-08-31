import * as React from "react";
import { BookData } from "../interfaces";
export interface BookProps {
    book: BookData;
    collectionUrl?: string;
    updateBook: (url: string | undefined) => Promise<BookData>;
    isSignedIn?: boolean;
    epubReaderUrlTemplate?: (epubUrl: string) => string;
}
/** Displays a single book for use in a lane, list, or grid view. */
export default class Book<P extends BookProps> extends React.Component<P, {}> {
    constructor(props: any);
    render(): JSX.Element;
    fields(): ({
        name: string;
        value: string | undefined;
    } | {
        name: string;
        value: string | null;
    })[];
    circulationLinks(): JSX.Element[];
    borrow(): Promise<BookData>;
}
