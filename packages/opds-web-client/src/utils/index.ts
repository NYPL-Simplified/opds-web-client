import { CollectionData, BookData } from "../interfaces";

/**
 * Utilities for dealing with redux state.
 */

export function loanedBookData(
  book: BookData,
  loans: BookData[] | undefined,
  bookUrl?: string
): BookData {
  if (!loans || loans.length === 0) {
    return book;
  }

  let loan = loans.find(loanedBook => {
    if (book) {
      return loanedBook.id === book.id;
    } else if (bookUrl) {
      return loanedBook.url === bookUrl;
    } else {
      return false;
    }
  });
  return loan || book;
}

export function collectionDataWithLoans(
  collectionData: CollectionData | null | undefined,
  loans: BookData[] | undefined
): CollectionData {
  // If any books in the collection are in the loans feed, replace them with their
  // loaned version. This currently only changes ungrouped books, not books in lanes,
  // since lanes don't need any loan-related information.
  return Object.assign({}, collectionData, {
    books: collectionData?.books?.map(book => loanedBookData(book, loans))
  });
}
