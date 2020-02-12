import { BookData, LinkData } from "./../interfaces";

/**
 *  A collection of utils for processing book data
 */

export function bookIsReserved(book: BookData) {
  return book.availability?.status === "reserved";
}

export function bookIsReady(book: BookData) {
  return book.availability?.status === "ready";
}

export function bookIsBorrowed(book: BookData) {
  return book.fulfillmentLinks?.length ?? 0 > 0;
}

export function bookIsOpenAccess(book: BookData) {
  return book.openAccessLinks?.length ?? 0 > 0;
}
