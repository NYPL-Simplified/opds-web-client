jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import BookDetails from "../BookDetails";
import BorrowButton from "../BorrowButton";
import DownloadButton from "../DownloadButton";

let book = {
  id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
  url: "http://circulation.librarysimplified.org/works/3M/crrmnr9",
  title: "The Mayan Secrets",
  authors: ["Clive Cussler", "Thomas Perry"],
  contributors: ["contributor 1"],
  summary: "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.",
  imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
  openAccessLinks: [{ url: "secrets.epub", type: "application/epub+zip" }],
  borrowUrl: "borrow url",
  publisher: "Penguin Publishing Group",
  published: "February 29, 2016",
  categories: ["category 1", "category 2"]
};

describe("BookDetails", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <BookDetails
        book={book}
        borrowBook={jest.genMockFunction()}
        fulfillBook={jest.genMockFunction()}
        indirectFulfillBook={jest.genMockFunction()}
        />
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
      <BookDetails
        book={bookCopy}
        borrowBook={jest.genMockFunction()}
        fulfillBook={jest.genMockFunction()}
        indirectFulfillBook={jest.genMockFunction()}
        />
    );

    let publisher = wrapper.find(".bookDetailsPublisher");
    expect(publisher.length).toBe(0);
  });

  it("shows publish date", () => {
    let published = wrapper.find(".bookDetailsPublished");
    expect(published.text()).toBe("Published: " + book.published);
  });

  it("shows categories", () => {
    let categories = wrapper.find(".bookDetailsCategories");
    expect(categories.text()).toBe("Categories: category 1, category 2");
  });

  it("doesn't show categories when there aren't any", () => {
    let bookCopy = Object.assign({}, book, { categories: [] });
    wrapper = shallow(
      <BookDetails
        book={bookCopy}
        borrowBook={jest.genMockFunction()}
        fulfillBook={jest.genMockFunction()}
        indirectFulfillBook={jest.genMockFunction()}
        />
    );

    let categories = wrapper.find(".bookDetailsCategories");
    expect(categories.length).toBe(0);
  });

  it("shows summary", () => {
    let summary = wrapper.find(".bookDetailsSummary");
    expect(summary.html()).toContain("Sam and Remi");
  });

  it("shows download button for open access url", () => {
    let button = wrapper.find(DownloadButton);
    expect(button.props().url).toBe("secrets.epub");
    expect(button.props().mimeType).toBe("application/epub+zip");
    expect(button.props().isPlainLink).toBe(true);
  });

  it("shows borrow/hold button", () => {
    let bookCopy = Object.assign({}, book, {
      borrowUrl: "borrow url"
    });
    let borrowBook = jest.genMockFunction();
    wrapper = shallow(
      <BookDetails
        book={bookCopy}
        borrowBook={borrowBook}
        fulfillBook={jest.genMockFunction()}
        indirectFulfillBook={jest.genMockFunction()}
        />
    );

    let button = wrapper.find(BorrowButton);
    expect(button.children().text()).toBe("Borrow");
    button.props().borrow();
    expect(borrowBook.mock.calls.length).toBe(1);
    expect(borrowBook.mock.calls[0][0]).toBe(bookCopy.borrowUrl);
    wrapper.setProps({
      book: Object.assign({}, bookCopy, {
        copies: { total: 2, available: 0 }
      })
    });
    button = wrapper.find(BorrowButton);
    expect(button.children().text()).toBe("Hold");
  });

  it("shows fulfill button if there's no download button", () => {
    let link = { url: "fulfillment url", type: "application/vnd.adobe.adept+xml" };
    let bookCopy = Object.assign({}, book, {
      openAccessLinks: [],
      fulfillmentLinks: [link]
    });
    let fulfillBook = jest.genMockFunction();
    let indirectFulfillBook = jest.genMockFunction();
    wrapper = shallow(
      <BookDetails
        book={bookCopy}
        borrowBook={jest.genMockFunction()}
        fulfillBook={fulfillBook}
        indirectFulfillBook={indirectFulfillBook}
        isSignedIn={false}
        />
    );
    let button = wrapper.find(DownloadButton);
    expect(button.props().fulfill).toBe(fulfillBook);
    expect(button.props().indirectFulfill).toBe(indirectFulfillBook);
    expect(button.props().url).toBe(link.url);
    expect(button.props().title).toBe(bookCopy.title);
    expect(button.props().mimeType).toBe(link.type);
    expect(button.props().isPlainLink).toBe(true);
  });

  it("shows 'on hold'", () => {
    let bookCopy = Object.assign({}, book, {
      openAccessLinks: [],
      availability: { status: "reserved" }
    });
    wrapper = shallow(
      <BookDetails
        book={bookCopy}
        borrowBook={jest.genMockFunction()}
        fulfillBook={jest.genMockFunction()}
        indirectFulfillBook={jest.genMockFunction()}
        />
    );
    let button = wrapper.find("button");
    expect(button.text()).toBe("On Hold");
    expect(button.props().className).toContain("disabled");
  });
});