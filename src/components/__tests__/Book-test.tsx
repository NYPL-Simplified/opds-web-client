jest.dontMock("../Book");
jest.dontMock("../Link");
jest.dontMock("../BookPreviewLink");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import Book from "../Book";

let book = {
  id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
  title: "The Mayan Secrets",
  authors: ["Clive Cussler", "Thomas Perry"],
  summary: "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.",
  imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
  publisher: "Penguin Publishing Group"
};

describe("Book", () => {
  it("shows the book cover", () => {
    let renderedBook = TestUtils.renderIntoDocument(
      <Book book={book} />
    );

    let coverImage = TestUtils.findRenderedDOMComponentWithTag(renderedBook, "img");
    expect(coverImage.getAttribute("src")).toEqual(book.imageUrl);
  });

  it("shows book info", () => {
    let renderedBook = TestUtils.renderIntoDocument(
      <Book book={book} />
    );

    let title = TestUtils.findRenderedDOMComponentWithClass(renderedBook, "bookTitle");
    expect(title.textContent).toEqual(book.title);

    let authors = TestUtils.findRenderedDOMComponentWithClass(renderedBook, "bookAuthors");
    expect(authors.textContent).toEqual(book.authors.join(", "));
  });
});