jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import Book from "../Book";
import { BookData } from "../../interfaces";
import BrowserLink from "../BrowserLink";

let book: BookData = {
  id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
  title: "The Mayan Secrets",
  authors: ["Clive Cussler", "Thomas Perry"],
  summary: "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.",
  imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
  openAccessUrl: "secrets.epub",
  publisher: "Penguin Publishing Group"
};

describe("Book", () => {
  it("shows the book cover with empty alt", () => {
    let wrapper = shallow(
      <Book book={book} />
    );

    let links = wrapper.find(BrowserLink);
    expect(links.length).toEqual(2);
    let coverImage = links.at(0).children().at(0);
    expect(coverImage.type()).toBe("img");
    expect(coverImage.props().src).toBe(book.imageUrl);
    expect(coverImage.props().alt).toBe("");
  });

  it("shows book info", () => {
    let wrapper = shallow(
      <Book book={book} />
    );

    let links = wrapper.find(BrowserLink);
    expect(links.length).toEqual(2);
    let bookInfo = links.at(1);
    let title = bookInfo.find(".bookTitle");
    let authors = bookInfo.find(".bookAuthors");

    expect(title.text()).toEqual(book.title);
    expect(authors.text()).toEqual(book.authors.join(", "));
  });

  it("shows contributors when there's no author", () => {
    let bookCopy = Object.assign({}, book, {
      authors: [],
      contributors: ["contributor"]
    });
    let wrapper = shallow(
      <Book book={bookCopy} />
    );

    let links = wrapper.find(BrowserLink);
    let bookInfo = links.at(1).children().at(1);
    let authors = bookInfo.find(".bookAuthors");
    expect(authors.text()).toEqual(bookCopy.contributors[0]);
  });
});