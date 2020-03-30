import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import * as moment from "moment";
import { shallow } from "enzyme";
import { AudioHeadphoneIcon } from "@nypl/dgx-svg-icons";

import BookDetails from "../BookDetails";
import BookCover from "../BookCover";
import BorrowButton from "../BorrowButton";
import DownloadButton from "../DownloadButton";
import { BookData } from "../../interfaces";

let book: BookData = {
  id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
  url: "http://circulation.librarysimplified.org/works/3M/crrmnr9",
  title: "The Mayan Secrets",
  authors: ["Clive Cussler", "Thomas Perry"],
  contributors: ["contributor 1"],
  subtitle: "A Sam and Remi Fargo Adventure",
  summary:
    "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.",
  imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
  openAccessLinks: [
    { url: "secrets.epub", type: "application/epub+zip" },
    { url: "secrets.mobi", type: "application/x-mobipocket-ebook" }
  ],
  borrowUrl: "borrow url",
  publisher: "Penguin Publishing Group",
  published: "February 29, 2016",
  categories: ["category 1", "category 2"],
  series: {
    name: "Fake Series"
  },
  language: "de",
  raw: {
    $: { "schema:additionalType": { value: "http://bib.schema.org/Audiobook" } }
  }
};

describe("BookDetails", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <BookDetails
        book={book}
        updateBook={stub()}
        epubReaderUrlTemplate={stub().returns("test reader url")}
      />
    );
  });

  it("shows cover", () => {
    let cover = wrapper.find(BookCover);
    expect(cover.props().book).to.equal(book);
  });

  it("shows title", () => {
    let title = wrapper.find(".title");
    expect(title.text()).to.equal(book.title);
  });

  it("shows subtitle", () => {
    let subtitle = wrapper.find(".subtitle");
    expect(subtitle.text()).to.equal(book.subtitle);
  });

  it("shows series", () => {
    let series = wrapper.find(".series");
    expect(series.text()).to.equal(book.series?.name);
  });

  it("shows authors", () => {
    let author = wrapper.find(".authors");
    expect(author.text()).to.equal(`By ${book.authors?.join(", ")}`);
  });

  it("shows contributors", () => {
    let contributor = wrapper.find(".contributors");
    expect(contributor.text()).to.equal(
      "Contributors: " + book.contributors?.join(", ")
    );
  });

  it("shows publisher", () => {
    let publisher = wrapper.find(".publisher");
    expect(publisher.text()).to.equal("Publisher: " + book.publisher);
  });

  it("shows media type", () => {
    let itemIcon = wrapper.find(".item-icon-container");
    let svg = itemIcon.find(AudioHeadphoneIcon);

    expect(svg.length).to.equal(1);
    expect(itemIcon.render().text()).to.equal("Audio/Headphone Icon Audio");
  });

  it("doesn't show publisher when there isn't one", () => {
    let bookCopy = Object.assign({}, book, {
      publisher: null
    });
    wrapper = shallow(<BookDetails book={bookCopy} updateBook={stub()} />);

    let publisher = wrapper.find(".publisher");
    expect(publisher.length).to.equal(0);
  });

  it("shows publish date", () => {
    let published = wrapper.find(".published");
    expect(published.text()).to.equal("Published: " + book.published);
  });

  it("shows categories", () => {
    let categories = wrapper.find(".categories");
    expect(categories.text()).to.equal("Categories: category 1, category 2");
  });

  it("doesn't show categories when there aren't any", () => {
    let bookCopy = Object.assign({}, book, { categories: [] });
    wrapper = shallow(<BookDetails book={bookCopy} updateBook={stub()} />);

    let categories = wrapper.find(".categories");
    expect(categories.length).to.equal(0);
  });

  it("has book's language as overall language for the top details", () => {
    let top = wrapper.find(".book-details > .top");
    expect(top.props().lang).to.equal("de");
  });

  it("has english as the language for the fields", () => {
    let fields = wrapper.find(".fields");
    expect(fields.props().lang).to.equal("en");
  });

  it("shows summary, in book's language", () => {
    let summary = wrapper.find(".summary");
    expect(summary.html()).to.contain("Sam and Remi");
    expect(summary.props().lang).to.equal("de");
  });

  it("shows download button for open access urls", () => {
    let buttons = wrapper.find(DownloadButton);
    expect(buttons.length).to.equal(2);
    let epubButton = buttons.at(0);
    let mobiButton = buttons.at(1);

    expect(epubButton.props().link.url).to.equal("secrets.epub");
    expect(epubButton.props().link.type).to.equal("application/epub+zip");
    expect(epubButton.props().isPlainLink).to.equal(true);

    expect(mobiButton.props().link.url).to.equal("secrets.mobi");
    expect(mobiButton.props().link.type).to.equal(
      "application/x-mobipocket-ebook"
    );
    expect(mobiButton.props().isPlainLink).to.equal(true);
  });

  it("shows read button for open access epub urls", () => {
    let buttons = wrapper.find(".read-button");
    expect(buttons.length).to.equal(1);
    expect(buttons.props().href).to.equal("test reader url");
  });

  it("shows borrow/hold button", () => {
    let bookCopy = Object.assign({}, book, {
      borrowUrl: "borrow url"
    });
    let updateBook = stub();
    wrapper = shallow(<BookDetails book={bookCopy} updateBook={updateBook} />);

    let button = wrapper.find(BorrowButton);
    expect(button.children().text()).to.equal("Borrow");
    button.props().borrow();
    expect(updateBook.callCount).to.equal(1);
    expect(updateBook.args[0][0]).to.equal(bookCopy.borrowUrl);
    wrapper.setProps({
      book: Object.assign({}, bookCopy, {
        copies: { total: 2, available: 0 }
      })
    });
    button = wrapper.find(BorrowButton);
    expect(button.children().text()).to.equal("Reserve");
  });

  it("shows fulfill button if there's no download button", () => {
    let link = {
      url: "fulfillment url",
      type: "application/vnd.adobe.adept+xml"
    };
    let bookCopy = Object.assign({}, book, {
      openAccessLinks: [],
      fulfillmentLinks: [link]
    });
    wrapper = shallow(
      <BookDetails book={bookCopy} updateBook={stub()} isSignedIn={false} />
    );
    let button = wrapper.find(DownloadButton);
    expect(button.props().link.url).to.equal(link.url);
    expect(button.props().title).to.equal(bookCopy.title);
    expect(button.props().link.type).to.equal(link.type);
    expect(button.props().isPlainLink).to.equal(true);
  });

  it("shows 'reserved'", () => {
    let bookCopy = Object.assign({}, book, {
      openAccessLinks: [],
      availability: { status: "reserved" }
    });
    wrapper = shallow(<BookDetails book={bookCopy} updateBook={stub()} />);
    let button = wrapper.find("button");
    expect(button.text()).to.equal("Reserved");
    expect(button.props().className).to.contain("disabled");
  });

  it("shows holds when there are no copies available", () => {
    let bookCopy = Object.assign({}, book, {
      openAccessLinks: [],
      copies: {
        available: 0,
        total: 12
      },
      holds: {
        total: 6
      }
    });
    wrapper = shallow(<BookDetails book={bookCopy} updateBook={stub()} />);
    let circulationInfo = wrapper.find(".circulation-info");
    expect(circulationInfo.text()).to.contain("0 of 12 copies available");
    expect(circulationInfo.text()).to.contain("6 patrons in hold queue");
  });

  it("doesn't show holds when there are copies available", () => {
    let bookCopy = Object.assign({}, book, {
      openAccessLinks: [],
      copies: {
        available: 5,
        total: 12
      },
      holds: {
        total: 6
      }
    });
    wrapper = shallow(<BookDetails book={bookCopy} updateBook={stub()} />);
    let circulationInfo = wrapper.find(".circulation-info");
    expect(circulationInfo.text()).to.contain("5 of 12 copies available");
    expect(circulationInfo.text()).not.to.contain("6");
  });

  it("shows circulation info for open access book", () => {
    let circulationInfo = wrapper.find(".circulation-info");
    expect(circulationInfo.text()).to.contain("open-access");
  });

  it("shows circulation info for borrowed book", () => {
    let tomorrow = moment()
      .add(1, "day")
      .format();
    let bookCopy = Object.assign({}, book, {
      openAccessLinks: [],
      fulfillmentLinks: ["http://fulfill"],
      availability: { status: "available", until: tomorrow }
    });
    wrapper = shallow(<BookDetails book={bookCopy} updateBook={stub()} />);
    let circulationInfo = wrapper.find(".circulation-info");
    expect(circulationInfo.text()).to.contain("on loan for a day");
  });

  it("shows circulation info for reserved book", () => {
    let bookCopy = Object.assign({}, book, {
      openAccessLinks: [],
      availability: { status: "reserved" },
      copies: {
        available: 0,
        total: 12
      },
      holds: {
        total: 6,
        position: 3
      }
    });
    wrapper = shallow(<BookDetails book={bookCopy} updateBook={stub()} />);
    let circulationInfo = wrapper.find(".circulation-info");
    expect(circulationInfo.text()).to.contain("0 of 12 copies available");
    expect(circulationInfo.text()).to.contain("6 patrons in hold queue");
    expect(circulationInfo.text()).to.contain("Your holds position: 3");
  });
});
