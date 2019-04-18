import * as React from "react";
import { LaneData, BookData } from "../interfaces";
export interface LaneProps {
    lane: LaneData;
    collectionUrl?: string;
    hideMoreLink?: boolean;
    hiddenBookIds?: string[];
    updateBook: (url: string) => Promise<BookData>;
    fulfillBook: (url: string) => Promise<Blob>;
    indirectFulfillBook: (url: string, type: string) => Promise<string>;
    isSignedIn?: boolean;
    epubReaderUrlTemplate?: (epubUrl: string) => string;
}
export interface LaneState {
    atLeft: boolean;
    atRight: boolean;
}
/** Shows one scrollable lane in a collection. */
export default class Lane extends React.Component<LaneProps, LaneState> {
    constructor(props: any);
    render(): JSX.Element;
    visibleBooks(): BookData[];
    getContainerWidth(): number;
    getScrollWidth(): number;
    getScroll(): number;
    changeScroll(delta: number): void;
    scrollBack(): void;
    scrollForward(): void;
    updateScrollButtons(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
