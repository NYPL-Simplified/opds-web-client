"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var PropTypes = require("prop-types");
var enzyme_1 = require("enzyme");
var dgx_svg_icons_1 = require("@nypl/dgx-svg-icons");
var react_redux_1 = require("react-redux");
var Book_1 = require("../Book");
var CatalogLink_1 = require("../CatalogLink");
var BookCover_1 = require("../BookCover");
var BorrowButton_1 = require("../BorrowButton");
var DownloadButton_1 = require("../DownloadButton");
var routing_1 = require("../../__mocks__/routing");
var ActionsContext_1 = require("../context/ActionsContext");
var store_1 = require("../../store");
var DataFetcher_1 = require("../../DataFetcher");
var OPDSDataAdapter_1 = require("../../OPDSDataAdapter");
var actions_1 = require("../../actions");
var book = {
    id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
    title: "The Mayan Secrets",
    authors: ["Clive Cussler", "Thomas Perry"],
    summary: "<strong>Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.</strong><br />Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.<br />The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out.",
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
describe("Book", function () {
    var updateBook;
    var epubReaderUrlTemplate;
    beforeEach(function () {
        updateBook = sinon_1.stub();
        epubReaderUrlTemplate = sinon_1.stub().returns("test reader url");
    });
    it("shows the book cover", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: book, updateBook: updateBook }));
        var links = wrapper.find(CatalogLink_1.default);
        var cover = links
            .at(0)
            .children()
            .at(0);
        chai_1.expect(cover.type()).to.equal(BookCover_1.default);
        chai_1.expect(cover.props().book).to.equal(book);
    });
    it("has language attribute matching the book's language", function () {
        var wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: book, updateBook: updateBook }));
        var bookElement = wrapper.find(".book");
        chai_1.expect(bookElement.props().lang).to.equal("de");
    });
    describe("compact info", function () {
        it("shows book info", function () {
            var _a;
            var wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: book, updateBook: updateBook }));
            var links = wrapper.find(CatalogLink_1.default);
            var bookInfo = links
                .at(0)
                .children()
                .at(1);
            var title = bookInfo.find(".title");
            var authors = bookInfo.find(".authors");
            chai_1.expect(title.text()).to.equal(book.title);
            chai_1.expect(authors.text()).to.equal("By " + ((_a = book.authors) === null || _a === void 0 ? void 0 : _a.join(", ")));
        });
        it("shows contributors when there's no author", function () {
            var bookCopy = Object.assign({}, book, {
                authors: [],
                contributors: ["contributor"]
            });
            var wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: bookCopy, updateBook: updateBook }));
            var links = wrapper.find(CatalogLink_1.default);
            var bookInfo = links
                .at(0)
                .children()
                .at(1);
            var authors = bookInfo.find(".authors");
            chai_1.expect(authors.text()).to.equal("By " + bookCopy.contributors[0]);
        });
        it("renders two icons and labels in the compact and expanded views", function () {
            var wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: book, updateBook: updateBook }));
            var itemIcon = wrapper.find(".item-icon");
            var svg = itemIcon.find(dgx_svg_icons_1.AudioHeadphoneIcon);
            chai_1.expect(svg.length).to.equal(2);
            chai_1.expect(itemIcon
                .first()
                .render()
                .text()).to.equal("Audio/Headphone Icon ");
        });
    });
    describe("expanded info", function () {
        var wrapper;
        beforeEach(function () {
            wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: book, updateBook: updateBook, epubReaderUrlTemplate: epubReaderUrlTemplate }));
        });
        it("shows header with title and authors", function () {
            var _a;
            var bookInfo = wrapper.find(".expanded-info");
            var title = bookInfo.find(".title");
            var authors = bookInfo.find(".authors");
            chai_1.expect(title.text()).to.equal(book.title);
            chai_1.expect(authors.text()).to.equal("By " + ((_a = book.authors) === null || _a === void 0 ? void 0 : _a.join(", ")));
        });
        it("shows contributors when there's no author", function () {
            var bookCopy = Object.assign({}, book, {
                authors: [],
                contributors: ["contributor"]
            });
            wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: bookCopy, updateBook: updateBook }));
            var bookInfo = wrapper.find(".expanded-info");
            var authors = bookInfo.find(".authors");
            chai_1.expect(authors.text()).to.equal("By " + bookCopy.contributors[0]);
        });
        it("shows series", function () {
            var _a;
            var bookInfo = wrapper.find(".expanded-info");
            var series = bookInfo.find(".series");
            chai_1.expect(series.text()).to.equal((_a = book.series) === null || _a === void 0 ? void 0 : _a.name);
        });
        it("shows publisher", function () {
            var publisher = wrapper.find(".publisher");
            chai_1.expect(publisher.text()).to.equal("Publisher: " + book.publisher);
        });
        it("doesn't show publisher when there isn't one", function () {
            var bookCopy = Object.assign({}, book, {
                publisher: null
            });
            wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: bookCopy, updateBook: sinon_1.stub() }));
            var publisher = wrapper.find(".publisher");
            chai_1.expect(publisher.length).to.equal(0);
        });
        it("shows publish date", function () {
            var published = wrapper.find(".published");
            chai_1.expect(published.text()).to.equal("Published: " + book.published);
        });
        it("shows categories", function () {
            var categories = wrapper.find(".categories");
            chai_1.expect(categories.text()).to.equal("Categories: category 1, category 2");
        });
        it("doesn't show categories when there aren't any", function () {
            var bookCopy = Object.assign({}, book, { categories: [] });
            wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: bookCopy, updateBook: sinon_1.stub() }));
            var categories = wrapper.find(".categories");
            chai_1.expect(categories.length).to.equal(0);
        });
        it("has english as the language for the fields", function () {
            var fields = wrapper.find(".fields");
            chai_1.expect(fields.props().lang).to.equal("en");
        });
        it("shows summary, in book's language, with html stripped out and more link", function () {
            var context = routing_1.mockRouterContext();
            var store = store_1.default();
            var fetcher = new DataFetcher_1.default({ adapter: OPDSDataAdapter_1.adapter });
            var actions = new actions_1.default(fetcher);
            wrapper = enzyme_1.mount(React.createElement(react_redux_1.Provider, { store: store },
                React.createElement(ActionsContext_1.ActionsProvider, { fetcher: fetcher, actions: actions },
                    React.createElement(Book_1.default, { book: book, updateBook: updateBook }))), {
                context: context,
                childContextTypes: {
                    router: PropTypes.object,
                    pathFor: PropTypes.func,
                    actions: PropTypes.any
                }
            });
            var summary = wrapper.find(".summary");
            chai_1.expect(summary.html()).to.contain("Sam and Remi");
            chai_1.expect(summary.html()).not.to.contain("strong");
            chai_1.expect(summary.props().lang).to.equal("de");
            var moreLink = summary.find("a");
            chai_1.expect(moreLink.length).to.equal(1);
            chai_1.expect(moreLink.html()).to.contain("More");
        });
        it("shows download button for open access urls", function () {
            var buttons = wrapper.find(DownloadButton_1.default);
            chai_1.expect(buttons.length).to.equal(2);
            var epubButton = buttons.at(0);
            var mobiButton = buttons.at(1);
            chai_1.expect(epubButton.props().link.url).to.equal("secrets.epub");
            chai_1.expect(epubButton.props().link.type).to.equal("application/epub+zip");
            chai_1.expect(epubButton.props().isPlainLink).to.equal(true);
            chai_1.expect(mobiButton.props().link.url).to.equal("secrets.mobi");
            chai_1.expect(mobiButton.props().link.type).to.equal("application/x-mobipocket-ebook");
            chai_1.expect(mobiButton.props().isPlainLink).to.equal(true);
        });
        it("shows read button for open access epub urls", function () {
            var buttons = wrapper.find(".read-button");
            chai_1.expect(buttons.length).to.equal(1);
            chai_1.expect(buttons.props().href).to.equal("test reader url");
        });
        it("shows borrow/hold button", function () {
            var bookCopy = Object.assign({}, book, {
                borrowUrl: "borrow url"
            });
            var updateBook = sinon_1.stub();
            wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: bookCopy, updateBook: updateBook }));
            var button = wrapper.find(BorrowButton_1.default);
            chai_1.expect(button.children().text()).to.equal("Borrow");
            button.props().borrow();
            chai_1.expect(updateBook.callCount).to.equal(1);
            chai_1.expect(updateBook.args[0][0]).to.equal(bookCopy.borrowUrl);
            wrapper.setProps({
                book: Object.assign({}, bookCopy, {
                    copies: { total: 2, available: 0 }
                })
            });
            button = wrapper.find(BorrowButton_1.default);
            chai_1.expect(button.children().text()).to.equal("Reserve");
        });
        it("shows fulfill button if there's no download button", function () {
            var link = {
                url: "fulfillment url",
                type: "application/vnd.adobe.adept+xml"
            };
            var bookCopy = Object.assign({}, book, {
                openAccessLinks: [],
                fulfillmentLinks: [link]
            });
            wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: bookCopy, updateBook: sinon_1.stub(), isSignedIn: false }));
            var button = wrapper.find(DownloadButton_1.default);
            chai_1.expect(button.props().link.url).to.equal(link.url);
            chai_1.expect(button.props().title).to.equal(bookCopy.title);
            chai_1.expect(button.props().link.type).to.equal(link.type);
            chai_1.expect(button.props().isPlainLink).to.equal(true);
        });
        it("shows 'borrowed'", function () {
            var link = {
                url: "fulfillment url",
                type: "application/vnd.adobe.adept+xml"
            };
            var bookCopy = Object.assign({}, book, {
                openAccessLinks: [],
                fulfillmentLinks: [link]
            });
            wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: bookCopy, updateBook: sinon_1.stub() }));
            var button = wrapper.find(BorrowButton_1.default);
            chai_1.expect(button.props().children).to.equal("Borrowed");
            chai_1.expect(button.props().disabled).to.equal(true);
        });
        it("shows 'reserved'", function () {
            var bookCopy = Object.assign({}, book, {
                openAccessLinks: [],
                availability: { status: "reserved" }
            });
            wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: bookCopy, updateBook: sinon_1.stub() }));
            var button = wrapper.find("button");
            chai_1.expect(button.text()).to.equal("Reserved");
            chai_1.expect(button.props().className).to.contain("disabled");
        });
        it("shows 'borrow' when a reserved book becomes available", function () {
            var bookCopy = Object.assign({}, book, {
                openAccessLinks: [],
                availability: { status: "ready" }
            });
            wrapper = enzyme_1.shallow(React.createElement(Book_1.default, { book: bookCopy, updateBook: sinon_1.stub() }));
            var button = wrapper.find(BorrowButton_1.default);
            chai_1.expect(button.length).to.equal(1);
            chai_1.expect(button.html()).to.contain("Borrow");
        });
    });
});
