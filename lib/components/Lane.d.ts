import * as React from "react";
import { LaneData, BookData } from "../interfaces";
export interface LaneProps {
    lane: LaneData;
    collectionUrl?: string;
    hideMoreLink?: boolean;
    hiddenBookIds?: string[];
    isSignedIn?: boolean;
    updateBook: (url: string) => Promise<BookData>;
    epubReaderUrlTemplate?: (epubUrl: string) => string;
}
export interface LaneState {
    atLeft: boolean;
    atRight: boolean;
}
/** Shows one scrollable lane in a collection. */
export default class Lane extends React.Component<LaneProps, LaneState> {
    constructor(props: any);
    render(): JSX.Element | null;
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
