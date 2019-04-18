import { OPDSFeed, OPDSEntry } from "opds-feed-parser";
import { CollectionData, BookData } from "./interfaces";
/** Converts OPDS data into the internal representation used by components. */
export declare function adapter(data: OPDSFeed | OPDSEntry, url: string): CollectionData | BookData;
export declare function entryToBook(entry: OPDSEntry, feedUrl: string): BookData;
export declare function feedToCollection(feed: OPDSFeed, feedUrl: string): CollectionData;
