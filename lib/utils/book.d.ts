import * as React from "react";
import { BookData, RequiredKeys, BookMedium } from "../interfaces";
/**
 *  A collection of utils for processing book data
 */
export declare function bookIsReserved(book: BookData): boolean;
export declare function bookIsReady(book: BookData): boolean;
export declare function bookIsBorrowed(book: BookData): book is RequiredKeys<BookData, "fulfillmentLinks">;
export declare function bookIsOpenAccess(book: BookData): book is RequiredKeys<BookData, "openAccessLinks">;
export declare function bookIsBorrowable(book: BookData): book is RequiredKeys<BookData, "borrowUrl">;
export declare function getMedium(book: BookData): BookMedium | "";
export declare const bookMediumSvgMap: {
    [key in BookMedium]: {
        element: React.ReactNode;
        label: "eBook" | "Audio";
    };
};
export declare function getMediumSVG(medium: BookMedium | "", displayLabel?: boolean): React.ReactNode | null;
