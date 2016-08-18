jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import LaneBook from "../LaneBook";
import { BookProps } from "../Book";
import CatalogLink, { CatalogLinkProps } from "../CatalogLink";
import BookCover from "../BookCover";
import { BookData } from "../../interfaces";

let book: BookData = {
  id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
  title: "The Mayan Secrets",
  authors: ["Clive Cussler", "Thomas Perry"],
  summary: "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.",
  imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
  publisher: "Penguin Publishing Group"
};

describe("LaneBook", () => {
  it("shows the book cover", () => {
    let wrapper = shallow(
      <LaneBook book={book} />
    );

    let cover = wrapper.find(BookCover);
    expect(cover.props().book).toBe(book);
  });

  it("shows book title in a CatalogLink", () => {
    let wrapper = shallow(
      <LaneBook book={book} />
    );

    let link = wrapper.find<CatalogLinkProps>(CatalogLink);
    let title = link.find(".bookTitle");

    expect(link.props().bookUrl).toBe(book.url);
    expect(title.text()).toBe(book.title);
  });
});