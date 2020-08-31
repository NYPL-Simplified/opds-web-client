"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var book_1 = require("../book");
var enzyme_1 = require("enzyme");
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
describe("book utils", function () {
    describe("getMedium function", function () {
        it("returns value with data or an empty string", function () {
            chai_1.expect(book_1.getMedium({})).to.equal("");
            chai_1.expect(book_1.getMedium({ raw: {} })).to.equal("");
            chai_1.expect(book_1.getMedium({ raw: { $: {} } })).to.equal("");
            chai_1.expect(book_1.getMedium({ raw: { $: { "schema:additionalType": {} } } })).to.equal("");
            chai_1.expect(book_1.getMedium(book)).to.equal("http://bib.schema.org/Audiobook");
        });
    });
    describe("getMediumSVG function", function () {
        it("returns null with no input", function () {
            chai_1.expect(book_1.getMediumSVG(undefined)).to.equal(null);
        });
        it("returns null with bad medium input", function () {
            chai_1.expect(book_1.getMediumSVG("video")).to.equal(null);
        });
        it("returns a component with the appropriate svg and label for the medium input", function () {
            chai_1.expect(enzyme_1.mount(book_1.getMediumSVG("http://bib.schema.org/Audiobook")).text()).to.equal("Audio/Headphone Icon Audio");
        });
        it("returns a component with the appropriate svg but no label for the medium input", function () {
            chai_1.expect(enzyme_1.mount(book_1.getMediumSVG("http://bib.schema.org/Audiobook", false)).text()).to.equal("Audio/Headphone Icon ");
        });
    });
});
