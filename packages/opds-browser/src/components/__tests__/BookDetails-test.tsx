jest.dontMock("../BookDetails");

import * as React from "react";
import { shallow } from "enzyme";

import BookDetails from "../BookDetails";

let book = {
  id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
  url: "http://circulation.librarysimplified.org/works/3M/crrmnr9",
  title: "The Mayan Secrets",
  authors: ["Clive Cussler", "Thomas Perry"],
  contributors: ["contributor 1"],
  summary: "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.",
  imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
  publisher: "Penguin Publishing Group",
  published: "February 29, 2016",
  categories: ["category 1", "category 2"]
};

describe("BookDetails", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <BookDetails book={book} />
    );
  });

  it("shows cover", () => {
    let coverImage = wrapper.find("img");
    expect(coverImage.props().src).toBe(book.imageUrl);
  });

  it("shows title", () => {
    let title = wrapper.find("h1");
    expect(title.text()).toBe(book.title);
  });

  it("shows authors", () => {
    let author = wrapper.find(".bookDetailsAuthors");
    expect(author.text()).toBe(book.authors.join(", "));
  });

  it("shows contributors", () => {
    let contributor = wrapper.find(".bookDetailsContributors");
    expect(contributor.text()).toBe("Contributors: " + book.contributors.join(", "));
  });

  it("shows publisher", () => {
    let publisher = wrapper.find(".bookDetailsPublisher");
    expect(publisher.text()).toBe("Publisher: " + book.publisher);
  });

  it("doesn't show publisher when there isn't one", () => {
    let bookCopy = Object.assign({}, book, {
      publisher: null
    });
    wrapper = shallow(
      <BookDetails book={bookCopy} />
    );

    let publisher = wrapper.find(".bookDetailsPublisher");
    expect(publisher.length).toEqual(0);
  });

  it("shows publish date", () => {
    let published = wrapper.find(".bookDetailsPublished");
    expect(published.text()).toEqual("Published: " + book.published);
  });

  it("shows categories", () => {
    let categories = wrapper.find(".bookDetailsCategories");
    expect(categories.text()).toEqual("Categories: category 1, category 2");
  });

  it("doesn't show categories when there aren't any", () => {
    let bookCopy = Object.assign({}, book, { categories: [] });
    wrapper = shallow(
      <BookDetails book={bookCopy} />
    );

    let categories = wrapper.find(".bookDetailsCategories");
    expect(categories.length).toEqual(0);
  });
});