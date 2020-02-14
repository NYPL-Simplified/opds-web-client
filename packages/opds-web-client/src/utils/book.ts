import { BookData, LinkData, RequiredKeys } from "./../interfaces";

/**
 *  A collection of utils for processing book data
 */

export function bookIsReserved(book: BookData) {
  return book.availability?.status === "reserved";
}

export function bookIsReady(book: BookData) {
  return book.availability?.status === "ready";
}

export function bookIsBorrowed(
  book: BookData
): book is RequiredKeys<BookData, "fulfillmentLinks"> {
  return (book.fulfillmentLinks?.length ?? 0) > 0;
}

export function bookIsOpenAccess(
  book: BookData
): book is RequiredKeys<BookData, "openAccessLinks"> {
  return (book.openAccessLinks?.length ?? 0) > 0;
}

export function bookIsBorrowable(
  book: BookData
): book is RequiredKeys<BookData, "borrowUrl"> {
  return typeof book.borrowUrl === "string";
}
