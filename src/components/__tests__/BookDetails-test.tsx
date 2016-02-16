jest.dontMock("../BookDetails");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import BookDetails from "../BookDetails";

let book = {
  id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
  url: "http://circulation.librarysimplified.org/works/3M/crrmnr9",
  title: "The Mayan Secrets",
  authors: ["Clive Cussler", "Thomas Perry"],
  summary: "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.",
  imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
  publisher: "Penguin Publishing Group",
  published: "February 29, 2016"
};

describe("BookDetails", () => {
  let renderedBook, hideBookDetails;

  beforeEach(() => {
    hideBookDetails = jest.genMockFunction();
    renderedBook = TestUtils.renderIntoDocument(
      <BookDetails {...book} hideBookDetails={hideBookDetails} />
    );
  });

  it("shows cover", () => {
    let coverImage = TestUtils.findRenderedDOMComponentWithTag(renderedBook, "img");
    expect(coverImage.getAttribute("src")).toEqual(book.imageUrl);
  });

  it("shows title", () => {
    let title = TestUtils.findRenderedDOMComponentWithTag(renderedBook, "h1");
    expect(title.textContent).toEqual(book.title);
  });

  it("shows authors", () => {
    let author = TestUtils.findRenderedDOMComponentWithClass(renderedBook, "bookDetailsAuthors");
    expect(author.textContent).toEqual(book.authors.join(", "));
  });

  it("shows publisher", () => {
    let publisher = TestUtils.findRenderedDOMComponentWithClass(renderedBook, "bookDetailsPublisher");
    expect(publisher.textContent).toEqual("Publisher: " + book.publisher);
  });

  it("doesn't show publisher when there isn't one", () => {
    let bookCopy = Object.assign({}, book, {
      publisher: null
    });
    renderedBook = TestUtils.renderIntoDocument(
      <BookDetails {...bookCopy} />
    );

    let publisher = TestUtils.scryRenderedDOMComponentsWithClass(renderedBook, "bookDetailsPublisher");
    expect(publisher.length).toEqual(0);
  });

  it("shows publish date", () => {
    let published = TestUtils.findRenderedDOMComponentWithClass(renderedBook, "bookDetailsPublished");
    expect(published.textContent).toEqual("Published: " + book.published);
  });

  it("shows categories", () => {
    let bookCopy = Object.assign({}, book, {
      categories: ["category 1", "category 2"]
    });
    renderedBook = TestUtils.renderIntoDocument(
      <BookDetails {...bookCopy} />
    );

    let categories = TestUtils.findRenderedDOMComponentWithClass(renderedBook, "bookDetailsCategories");
    expect(categories.textContent).toEqual("Categories: category 1, category 2");
  });

  it("doesn't show categories when there aren't any", () => {
    let categories = TestUtils.scryRenderedDOMComponentsWithClass(renderedBook, "bookDetailsCategories");
    expect(categories.length).toEqual(0);
  });

  it("hides when close link is clicked", () => {
    let link = TestUtils.findRenderedDOMComponentWithClass(renderedBook, "bookDetailsCloseLink");
    expect(link.textContent).toEqual("Close");
    TestUtils.Simulate.click(link);
    expect(hideBookDetails.mock.calls.length).toBe(1);
  });

  it("hides when background screen is clicked", () => {
    let screen = TestUtils.findRenderedDOMComponentWithClass(renderedBook, "bookDetailsScreen");
    TestUtils.Simulate.click(screen);
    expect(hideBookDetails.mock.calls.length).toBe(1);
  });
});