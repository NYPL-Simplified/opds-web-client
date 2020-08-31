"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var moment = require("moment");
var enzyme_1 = require("enzyme");
var dgx_svg_icons_1 = require("@nypl/dgx-svg-icons");
var BookDetails_1 = require("../BookDetails");
var BookCover_1 = require("../BookCover");
var BorrowButton_1 = require("../BorrowButton");
var DownloadButton_1 = require("../DownloadButton");
var book = {
    id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
    url: "http://circulation.librarysimplified.org/works/3M/crrmnr9",
    title: "The Mayan Secrets",
    authors: ["Clive Cussler", "Thomas Perry"],
    contributors: ["contributor 1"],
    subtitle: "A Sam and Remi Fargo Adventure",
    summary: "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.",
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
describe("BookDetails", function () {
    var wrapper;
    beforeEach(function () {
        wrapper = enzyme_1.shallow(React.createElement(BookDetails_1.default, { book: book, updateBook: sinon_1.stub(), epubReaderUrlTemplate: sinon_1.stub().returns("test reader url") }));
    });
    it("shows cover", function () {
        var cover = wrapper.find(BookCover_1.default);
        chai_1.expect(cover.props().book).to.equal(book);
    });
    it("shows title", function () {
        var title = wrapper.find(".title");
        chai_1.expect(title.text()).to.equal(book.title);
    });
    it("shows subtitle", function () {
        var subtitle = wrapper.find(".subtitle");
        chai_1.expect(subtitle.text()).to.equal(book.subtitle);
    });
    it("shows series", function () {
        var _a;
        var series = wrapper.find(".series");
        chai_1.expect(series.text()).to.equal((_a = book.series) === null || _a === void 0 ? void 0 : _a.name);
    });
    it("shows authors", function () {
        var _a;
        var author = wrapper.find(".authors");
        chai_1.expect(author.text()).to.equal("By " + ((_a = book.authors) === null || _a === void 0 ? void 0 : _a.join(", ")));
    });
    it("shows contributors", function () {
        var _a;
        var contributor = wrapper.find(".contributors");
        chai_1.expect(contributor.text()).to.equal("Contributors: " + ((_a = book.contributors) === null || _a === void 0 ? void 0 : _a.join(", ")));
    });
    it("shows publisher", function () {
        var publisher = wrapper.find(".publisher");
        chai_1.expect(publisher.text()).to.equal("Publisher: " + book.publisher);
    });
    it("shows media type", function () {
        var itemIcon = wrapper.find(".item-icon-container");
        var svg = itemIcon.find(dgx_svg_icons_1.AudioHeadphoneIcon);
        chai_1.expect(svg.length).to.equal(1);
        chai_1.expect(itemIcon.render().text()).to.equal("Audio/Headphone Icon Audio");
    });
    it("doesn't show publisher when there isn't one", function () {
        var bookCopy = Object.assign({}, book, {
            publisher: null
        });
        wrapper = enzyme_1.shallow(React.createElement(BookDetails_1.default, { book: bookCopy, updateBook: sinon_1.stub() }));
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
        wrapper = enzyme_1.shallow(React.createElement(BookDetails_1.default, { book: bookCopy, updateBook: sinon_1.stub() }));
        var categories = wrapper.find(".categories");
        chai_1.expect(categories.length).to.equal(0);
    });
    it("has book's language as overall language for the top details", function () {
        var top = wrapper.find(".book-details > .top");
        chai_1.expect(top.props().lang).to.equal("de");
    });
    it("has english as the language for the fields", function () {
        var fields = wrapper.find(".fields");
        chai_1.expect(fields.props().lang).to.equal("en");
    });
    it("shows summary, in book's language", function () {
        var summary = wrapper.find(".summary");
        chai_1.expect(summary.html()).to.contain("Sam and Remi");
        chai_1.expect(summary.props().lang).to.equal("de");
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
        wrapper = enzyme_1.shallow(React.createElement(BookDetails_1.default, { book: bookCopy, updateBook: updateBook }));
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
        wrapper = enzyme_1.shallow(React.createElement(BookDetails_1.default, { book: bookCopy, updateBook: sinon_1.stub(), isSignedIn: false }));
        var button = wrapper.find(DownloadButton_1.default);
        chai_1.expect(button.props().link.url).to.equal(link.url);
        chai_1.expect(button.props().title).to.equal(bookCopy.title);
        chai_1.expect(button.props().link.type).to.equal(link.type);
        chai_1.expect(button.props().isPlainLink).to.equal(true);
    });
    it("shows 'reserved'", function () {
        var bookCopy = Object.assign({}, book, {
            openAccessLinks: [],
            availability: { status: "reserved" }
        });
        wrapper = enzyme_1.shallow(React.createElement(BookDetails_1.default, { book: bookCopy, updateBook: sinon_1.stub() }));
        var button = wrapper.find("button");
        chai_1.expect(button.text()).to.equal("Reserved");
        chai_1.expect(button.props().className).to.contain("disabled");
    });
    it("shows holds when there are no copies available", function () {
        var bookCopy = Object.assign({}, book, {
            openAccessLinks: [],
            copies: {
                available: 0,
                total: 12
            },
            holds: {
                total: 6
            }
        });
        wrapper = enzyme_1.shallow(React.createElement(BookDetails_1.default, { book: bookCopy, updateBook: sinon_1.stub() }));
        var circulationInfo = wrapper.find(".circulation-info");
        chai_1.expect(circulationInfo.text()).to.contain("0 of 12 copies available");
        chai_1.expect(circulationInfo.text()).to.contain("6 patrons in hold queue");
    });
    it("doesn't show holds when there are copies available", function () {
        var bookCopy = Object.assign({}, book, {
            openAccessLinks: [],
            copies: {
                available: 5,
                total: 12
            },
            holds: {
                total: 6
            }
        });
        wrapper = enzyme_1.shallow(React.createElement(BookDetails_1.default, { book: bookCopy, updateBook: sinon_1.stub() }));
        var circulationInfo = wrapper.find(".circulation-info");
        chai_1.expect(circulationInfo.text()).to.contain("5 of 12 copies available");
        chai_1.expect(circulationInfo.text()).not.to.contain("6");
    });
    it("shows circulation info for open access book", function () {
        var circulationInfo = wrapper.find(".circulation-info");
        chai_1.expect(circulationInfo.text()).to.contain("open-access");
    });
    it("shows circulation info for borrowed book", function () {
        var tomorrow = moment()
            .add(1, "day")
            .format();
        var bookCopy = Object.assign({}, book, {
            openAccessLinks: [],
            fulfillmentLinks: ["http://fulfill"],
            availability: { status: "available", until: tomorrow }
        });
        wrapper = enzyme_1.shallow(React.createElement(BookDetails_1.default, { book: bookCopy, updateBook: sinon_1.stub() }));
        var circulationInfo = wrapper.find(".circulation-info");
        chai_1.expect(circulationInfo.text()).to.contain("on loan for a day");
    });
    it("shows circulation info for reserved book", function () {
        var bookCopy = Object.assign({}, book, {
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
        wrapper = enzyme_1.shallow(React.createElement(BookDetails_1.default, { book: bookCopy, updateBook: sinon_1.stub() }));
        var circulationInfo = wrapper.find(".circulation-info");
        chai_1.expect(circulationInfo.text()).to.contain("0 of 12 copies available");
        chai_1.expect(circulationInfo.text()).to.contain("6 patrons in hold queue");
        chai_1.expect(circulationInfo.text()).to.contain("Your holds position: 3");
    });
});
