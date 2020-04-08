import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import * as PropTypes from "prop-types";
import { shallow, mount } from "enzyme";
import { AudioHeadphoneIcon } from "@nypl/dgx-svg-icons";
import { Provider } from "react-redux";

import Book from "../Book";
import { BookData } from "../../interfaces";
import CatalogLink from "../CatalogLink";
import BookCover from "../BookCover";
import BorrowButton from "../BorrowButton";
import DownloadButton from "../DownloadButton";
import { mockRouterContext } from "../../__mocks__/routing";
import { ActionsProvider } from "../context/ActionsContext";
import buildStore from "../../store";
import DataFetcher from "../../DataFetcher";
import { adapter } from "../../OPDSDataAdapter";
import ActionsCreator from "../../actions";

let book: BookData = {
  id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
  title: "The Mayan Secrets",
  authors: ["Clive Cussler", "Thomas Perry"],
  summary:
    "<strong>Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.</strong><br />Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.<br />The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out.",
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

describe("Book", () => {
  let updateBook;
  let epubReaderUrlTemplate;

  beforeEach(() => {
    updateBook = stub();
    epubReaderUrlTemplate = stub().returns("test reader url");
  });

  it("shows the book cover", () => {
    let wrapper = shallow(<Book book={book} updateBook={updateBook} />);

    let links = wrapper.find(CatalogLink);
    let cover = links
      .at(0)
      .children()
      .at(0);
    expect(cover.type()).to.equal(BookCover);
    expect(cover.props().book).to.equal(book);
  });

  it("has language attribute matching the book's language", () => {
    let wrapper = shallow(<Book book={book} updateBook={updateBook} />);

    let bookElement = wrapper.find(".book");
    expect(bookElement.props().lang).to.equal("de");
  });

  describe("compact info", () => {
    it("shows book info", () => {
      let wrapper = shallow(<Book book={book} updateBook={updateBook} />);

      let links = wrapper.find(CatalogLink);
      let bookInfo = links
        .at(0)
        .children()
        .at(1);
      let title = bookInfo.find(".title");
      let authors = bookInfo.find(".authors");

      expect(title.text()).to.equal(book.title);
      expect(authors.text()).to.equal(`By ${book.authors?.join(", ")}`);
    });

    it("shows contributors when there's no author", () => {
      let bookCopy = Object.assign({}, book, {
        authors: [],
        contributors: ["contributor"]
      });
      let wrapper = shallow(<Book book={bookCopy} updateBook={updateBook} />);

      let links = wrapper.find(CatalogLink);
      let bookInfo = links
        .at(0)
        .children()
        .at(1);
      let authors = bookInfo.find(".authors");
      expect(authors.text()).to.equal(`By ${bookCopy.contributors[0]}`);
    });

    it("renders two icons and labels in the compact and expanded views", () => {
      let wrapper = shallow(<Book book={book} updateBook={updateBook} />);

      let itemIcon = wrapper.find(".item-icon");
      let svg = itemIcon.find(AudioHeadphoneIcon);

      expect(svg.length).to.equal(2);
      expect(
        itemIcon
          .first()
          .render()
          .text()
      ).to.equal("Audio/Headphone Icon ");
    });
  });

  describe("expanded info", () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(
        <Book
          book={book}
          updateBook={updateBook}
          epubReaderUrlTemplate={epubReaderUrlTemplate}
        />
      );
    });

    it("shows header with title and authors", () => {
      let bookInfo = wrapper.find(".expanded-info");
      let title = bookInfo.find(".title");
      let authors = bookInfo.find(".authors");

      expect(title.text()).to.equal(book.title);
      expect(authors.text()).to.equal(`By ${book.authors?.join(", ")}`);
    });

    it("shows contributors when there's no author", () => {
      let bookCopy = Object.assign({}, book, {
        authors: [],
        contributors: ["contributor"]
      });
      wrapper = shallow(<Book book={bookCopy} updateBook={updateBook} />);

      let bookInfo = wrapper.find(".expanded-info");
      let authors = bookInfo.find(".authors");
      expect(authors.text()).to.equal(`By ${bookCopy.contributors[0]}`);
    });

    it("shows series", () => {
      let bookInfo = wrapper.find(".expanded-info");
      let series = bookInfo.find(".series");
      expect(series.text()).to.equal(book.series?.name);
    });

    it("shows publisher", () => {
      let publisher = wrapper.find(".publisher");
      expect(publisher.text()).to.equal("Publisher: " + book.publisher);
    });

    it("doesn't show publisher when there isn't one", () => {
      let bookCopy = Object.assign({}, book, {
        publisher: null
      });
      wrapper = shallow(<Book book={bookCopy} updateBook={stub()} />);

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
      wrapper = shallow(<Book book={bookCopy} updateBook={stub()} />);

      let categories = wrapper.find(".categories");
      expect(categories.length).to.equal(0);
    });

    it("has english as the language for the fields", () => {
      let fields = wrapper.find(".fields");
      expect(fields.props().lang).to.equal("en");
    });

    it("shows summary, in book's language, with html stripped out and more link", () => {
      let context = mockRouterContext();
      let store = buildStore();
      const fetcher = new DataFetcher({ adapter });
      const actions = new ActionsCreator(fetcher);

      wrapper = mount(
        <Provider store={store}>
          <ActionsProvider fetcher={fetcher} actions={actions}>
            <Book book={book} updateBook={updateBook} />
          </ActionsProvider>
        </Provider>,
        {
          context,
          childContextTypes: {
            router: PropTypes.object,
            pathFor: PropTypes.func,
            actions: PropTypes.any
          }
        }
      );
      let summary = wrapper.find(".summary");
      expect(summary.html()).to.contain("Sam and Remi");
      expect(summary.html()).not.to.contain("strong");
      expect(summary.props().lang).to.equal("de");
      let moreLink = summary.find("a");
      expect(moreLink.length).to.equal(1);
      expect(moreLink.html()).to.contain("More");
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
      wrapper = shallow(<Book book={bookCopy} updateBook={updateBook} />);

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
        <Book book={bookCopy} updateBook={stub()} isSignedIn={false} />
      );
      let button = wrapper.find(DownloadButton);
      expect(button.props().link.url).to.equal(link.url);
      expect(button.props().title).to.equal(bookCopy.title);
      expect(button.props().link.type).to.equal(link.type);
      expect(button.props().isPlainLink).to.equal(true);
    });

    it("shows 'borrowed'", () => {
      let link = {
        url: "fulfillment url",
        type: "application/vnd.adobe.adept+xml"
      };
      let bookCopy = Object.assign({}, book, {
        openAccessLinks: [],
        fulfillmentLinks: [link]
      });
      wrapper = shallow(<Book book={bookCopy} updateBook={stub()} />);
      let button = wrapper.find(BorrowButton);
      expect(button.props().children).to.equal("Borrowed");
      expect(button.props().disabled).to.equal(true);
    });

    it("shows 'reserved'", () => {
      let bookCopy = Object.assign({}, book, {
        openAccessLinks: [],
        availability: { status: "reserved" }
      });
      wrapper = shallow(<Book book={bookCopy} updateBook={stub()} />);
      let button = wrapper.find("button");
      expect(button.text()).to.equal("Reserved");
      expect(button.props().className).to.contain("disabled");
    });

    it("shows 'borrow' when a reserved book becomes available", () => {
      let bookCopy = Object.assign({}, book, {
        openAccessLinks: [],
        availability: { status: "ready" }
      });
      wrapper = shallow(<Book book={bookCopy} updateBook={stub()} />);
      let button = wrapper.find(BorrowButton);
      expect(button.length).to.equal(1);
      expect(button.html()).to.contain("Borrow");
    });
  });
});
