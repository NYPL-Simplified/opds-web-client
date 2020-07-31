import { CollectionData, BookData } from "../interfaces";
/**
 * Utilities for dealing with redux state.
 */
export declare function loanedBookData(book: BookData, loans: BookData[] | undefined, bookUrl?: string): BookData;
export declare function collectionDataWithLoans(collectionData: CollectionData | null | undefined, loans: BookData[] | undefined): CollectionData;
