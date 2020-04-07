import * as React from "react";
import { BookData, LinkData, RequiredKeys, BookMedium } from "../interfaces";
import { AudioHeadphoneIcon, BookIcon } from "@nypl/dgx-svg-icons";

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

export function getMedium(book: BookData): BookMedium | "" {
  if (!book.raw || !book.raw["$"] || !book.raw["$"]["schema:additionalType"]) {
    return "";
  }

  return book.raw["$"]["schema:additionalType"].value
    ? book.raw["$"]["schema:additionalType"].value
    : "";
}

export const bookMediumSvgMap: {
  [key in BookMedium]: {
    element: React.ReactNode;
    label: "eBook" | "Audio";
  };
} = {
  "http://bib.schema.org/Audiobook": {
    element: <AudioHeadphoneIcon ariaHidden title="Audio/Headphone Icon" />,
    label: "Audio"
  },
  "http://schema.org/EBook": {
    element: <BookIcon ariaHidden title="eBook Icon" />,
    label: "eBook"
  },
  "http://schema.org/Book": {
    element: <BookIcon ariaHidden title="eBook Icon" />,
    label: "eBook"
  }
};

export function getMediumSVG(
  medium: BookMedium | "",
  displayLabel = true
): React.ReactNode | null {
  if (!medium || Object.keys(bookMediumSvgMap).indexOf(medium) === -1) {
    return null;
  }
  const svgElm = bookMediumSvgMap[medium];

  return (
    <div className="item-icon">
      {svgElm.element} {displayLabel ? svgElm.label : null}
    </div>
  );
}
