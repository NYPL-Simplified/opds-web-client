import Book, { BookProps } from "./Book";
export interface BookDetailsProps extends BookProps {
}
/** Detail page for a single book. */
export default class BookDetails<P extends BookDetailsProps> extends Book<P> {
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    setBodyOverflow(value: string): void;
    circulationInfo(): JSX.Element[];
    /**
     * rightColumnLinks
     * Not used in this app but can be overridden to add links on the
     * right column, such as adding links to report a problem.
     */
    rightColumnLinks(): any;
}
