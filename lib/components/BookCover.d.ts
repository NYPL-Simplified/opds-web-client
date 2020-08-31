import * as React from "react";
import { BookData } from "../interfaces";
export interface BookCoverProps extends React.HTMLProps<BookCover> {
    book: BookData;
}
export interface BookCoverState {
    error: boolean;
}
/** Shows a cover image from the OPDS feed or an automatically generated cover for
    a single book. */
export default class BookCover extends React.Component<BookCoverProps, BookCoverState> {
    constructor(props: any);
    handleError(event: any): void;
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
    computeFontSize(text: string, baseFontSize?: number, minFontSize?: number): string;
    seededRandomHue(seed: any): number;
}
