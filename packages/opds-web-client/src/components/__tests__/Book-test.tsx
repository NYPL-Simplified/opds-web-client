import { expect } from "chai";

import * as React from "react";
import { shallow } from "enzyme";

import Book from "../Book";
import { BookData } from "../../interfaces";
import CatalogLink from "../CatalogLink";
import BookCover from "../BookCover";

let book: BookData = {
  id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
  title: "The Mayan Secrets",
  authors: ["Clive Cussler", "Thomas Perry"],
  summary: "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.",
  imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
  openAccessLinks: [{ url: "secrets.epub", type: "application/epub+zip" }],
  publisher: "Penguin Publishing Group"
};

describe("Book", () => {
  it("shows the book cover", () => {
    let wrapper = shallow(
      <Book book={book} />
    );

    let links = wrapper.find(CatalogLink);
    expect(links.length).to.equal(2);
    let cover = links.at(0).children().at(0);
    expect(cover.type()).to.equal(BookCover);
    expect(cover.props().book).to.equal(book);
  });

  it("shows book info", () => {
    let wrapper = shallow(
      <Book book={book} />
    );

    let links = wrapper.find(CatalogLink);
    expect(links.length).to.equal(2);
    let bookInfo = links.at(1);
    let title = bookInfo.find(".bookTitle");
    let authors = bookInfo.find(".bookAuthors");

    expect(title.text()).to.equal(book.title);
    expect(authors.text()).to.equal(book.authors.join(", "));
  });

  it("shows contributors when there's no author", () => {
    let bookCopy = Object.assign({}, book, {
      authors: [],
      contributors: ["contributor"]
    });
    let wrapper = shallow(
      <Book book={bookCopy} />
    );

    let links = wrapper.find(CatalogLink);
    let bookInfo = links.at(1).children().at(1);
    let authors = bookInfo.find(".bookAuthors");
    expect(authors.text()).to.equal(bookCopy.contributors[0]);
  });
});