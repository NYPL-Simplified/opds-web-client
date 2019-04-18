"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var opds_feed_parser_1 = require("opds-feed-parser");
var factory = require("./OPDSFactory");
var OPDSDataAdapter_1 = require("../OPDSDataAdapter");
var sanitizeHtml = require("dompurify").sanitize;
describe("OPDSDataAdapter", function () {
    it("extracts book info", function () {
        var largeImageLink = factory.artworkLink({
            href: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
            rel: "http://opds-spec.org/image",
        });
        var thumbImageLink = factory.artworkLink({
            href: "http://example.com/testthumb.jpg",
            rel: "http://opds-spec.org/image/thumbnail",
        });
        var openAccessLink = factory.acquisitionLink({
            href: "http://example.com/open.epub",
            rel: opds_feed_parser_1.OPDSAcquisitionLink.OPEN_ACCESS_REL
        });
        var borrowLink = factory.acquisitionLink({
            href: "http://example.com/borrow",
            rel: opds_feed_parser_1.OPDSAcquisitionLink.BORROW_REL,
            availability: { availability: "unavailable" },
            holds: { total: 20, position: 5 },
            copies: { total: 2, available: 0 }
        });
        var fulfillmentLink = factory.acquisitionLink({
            href: "http://example.com/fulfill",
            rel: opds_feed_parser_1.OPDSAcquisitionLink.GENERIC_REL,
            type: "application/atom+xml;type=entry;profile=opds-catalog",
            indirectAcquisitions: [{
                    type: "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media"
                }]
        });
        var collectionLink = factory.collectionLink({
            href: "collection%20url",
            rel: opds_feed_parser_1.OPDSCollectionLink.REL,
            title: "collection title"
        });
        var entry = factory.entry({
            id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
            title: "The Mayan Secrets",
            authors: [factory.contributor({ name: "Clive Cussler" }), factory.contributor({ name: "Thomas Perry" })],
            contributors: [factory.contributor({ name: "contributor" })],
            summary: factory.summary({ content: "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.<script>alert('danger!');</script>" }),
            categories: [factory.category({ label: "label" }), factory.category({ term: "no label" }), factory.category({ label: "label 2" })],
            links: [largeImageLink, thumbImageLink, openAccessLink, borrowLink, fulfillmentLink, collectionLink],
            issued: "2014-06-08T22:45:58Z",
            publisher: "Fake Publisher",
            series: {
                name: "Fake Series",
                position: 2
            },
            language: "en"
        });
        var acquisitionFeed = factory.acquisitionFeed({
            id: "some id",
            entries: [entry],
            unparsed: "unparsed data"
        });
        var collection = OPDSDataAdapter_1.feedToCollection(acquisitionFeed, "");
        chai_1.expect(collection.books.length).to.equal(0);
        chai_1.expect(collection.lanes.length).to.equal(1);
        chai_1.expect(collection.lanes[0].url).to.equal(collectionLink.href);
        chai_1.expect(collection.raw).to.equal("unparsed data");
        var book = collection.lanes[0].books[0];
        chai_1.expect(book.id).to.equal(entry.id);
        chai_1.expect(book.title).to.equal(entry.title);
        chai_1.expect(book.authors.length).to.equal(2);
        chai_1.expect(book.authors[0]).to.equal(entry.authors[0].name);
        chai_1.expect(book.authors[1]).to.equal(entry.authors[1].name);
        chai_1.expect(book.contributors.length).to.equal(1);
        chai_1.expect(book.contributors[0]).to.equal(entry.contributors[0].name);
        chai_1.expect(book.series.name).to.equal(entry.series.name);
        chai_1.expect(book.series.position).to.equal(entry.series.position);
        chai_1.expect(book.summary).to.equal(sanitizeHtml(entry.summary.content));
        chai_1.expect(book.summary).to.contain("Many men and women are going to die for that book.");
        chai_1.expect(book.summary).not.to.contain("script");
        chai_1.expect(book.summary).not.to.contain("danger");
        chai_1.expect(book.categories.length).to.equal(2);
        chai_1.expect(book.categories).to.contain("label");
        chai_1.expect(book.categories).to.contain("label 2");
        chai_1.expect(book.imageUrl).to.equal(thumbImageLink.href);
        chai_1.expect(book.publisher).to.equal("Fake Publisher");
        chai_1.expect(book.published).to.equal("June 8, 2014");
        chai_1.expect(book.language).to.equal("en");
        chai_1.expect(book.openAccessLinks[0].url).to.equal(openAccessLink.href);
        chai_1.expect(book.borrowUrl).to.equal(borrowLink.href);
        chai_1.expect(book.fulfillmentLinks[0].url).to.equal(fulfillmentLink.href);
        chai_1.expect(book.fulfillmentLinks[0].type).to.equal(fulfillmentLink.type);
        chai_1.expect(book.fulfillmentLinks[0].indirectType).to.equal(fulfillmentLink.indirectAcquisitions[0].type);
        chai_1.expect(book.availability).to.equal(borrowLink.availability);
        chai_1.expect(book.holds).to.equal(borrowLink.holds);
        chai_1.expect(book.copies).to.equal(borrowLink.copies);
    });
    it("extracts navigation link info", function () {
        var navigationLink = factory.link({
            href: "href",
        });
        var linkEntry = factory.entry({
            id: "feed.xml",
            title: "Feed",
            links: [navigationLink],
        });
        var navigationFeed = factory.navigationFeed({
            id: "some id",
            entries: [linkEntry],
        });
        var collection = OPDSDataAdapter_1.feedToCollection(navigationFeed, "");
        chai_1.expect(collection.navigationLinks.length).to.equal(1);
        var link = collection.navigationLinks[0];
        chai_1.expect(link.id).to.equal(linkEntry.id);
        chai_1.expect(link.text).to.equal(linkEntry.title);
        chai_1.expect(link.url).to.equal(navigationLink.href);
    });
    it("extracts facet groups", function () {
        var facetLinks = [
            factory.facetLink({
                href: "href1",
                title: "title 1",
                facetGroup: "group A",
                activeFacet: true
            }),
            factory.facetLink({
                href: "href2",
                title: "title 2",
                facetGroup: "group B",
                activeFacet: false
            }),
            factory.facetLink({
                href: "href3",
                title: "title 3",
                facetGroup: "group A"
            })
        ];
        var acquisitionFeed = factory.acquisitionFeed({
            id: "some id",
            entries: [],
            links: facetLinks,
        });
        var collection = OPDSDataAdapter_1.feedToCollection(acquisitionFeed, "");
        chai_1.expect(collection.facetGroups.length).to.equal(2);
        var groupA = collection.facetGroups[0];
        chai_1.expect(groupA.label).to.equal("group A");
        chai_1.expect(groupA.facets.length).to.equal(2);
        var groupB = collection.facetGroups[1];
        chai_1.expect(groupB.label).to.equal("group B");
        chai_1.expect(groupB.facets.length).to.equal(1);
        var facet1 = groupA.facets[0];
        chai_1.expect(facet1.label).to.equal("title 1");
        chai_1.expect(facet1.active).to.be.ok;
        chai_1.expect(facet1.href).to.equal("href1");
        var facet2 = groupB.facets[0];
        chai_1.expect(facet2.label).to.equal("title 2");
        chai_1.expect(facet2.active).not.to.be.ok;
        chai_1.expect(facet2.href).to.equal("href2");
        var facet3 = groupA.facets[1];
        chai_1.expect(facet3.label).to.equal("title 3");
        chai_1.expect(facet3.active).not.to.be.ok;
        chai_1.expect(facet3.href).to.equal("href3");
    });
    it("extracts search link", function () {
        var searchLink = factory.searchLink({
            href: "search%20url",
        });
        var navigationFeed = factory.navigationFeed({
            id: "some id",
            entries: [],
            links: [searchLink],
        });
        var collection = OPDSDataAdapter_1.feedToCollection(navigationFeed, "");
        chai_1.expect(collection.search).to.be.ok;
        chai_1.expect(collection.search.url).to.equal(searchLink.href);
    });
    it("extracts next page url", function () {
        var nextLink = factory.link({
            href: "href",
            rel: "next"
        });
        var acquisitionFeed = factory.acquisitionFeed({
            id: "some id",
            entries: [],
            links: [nextLink]
        });
        var collection = OPDSDataAdapter_1.feedToCollection(acquisitionFeed, "");
        chai_1.expect(collection.nextPageUrl).to.be.ok;
        chai_1.expect(collection.nextPageUrl).to.equal("href");
    });
    it("extracts shelf url", function () {
        var shelfLink = factory.shelfLink({
            href: "loans",
            rel: opds_feed_parser_1.OPDSShelfLink.REL
        });
        var acquisitionFeed = factory.acquisitionFeed({
            id: "some id",
            entries: [],
            links: [shelfLink]
        });
        var collection = OPDSDataAdapter_1.feedToCollection(acquisitionFeed, "");
        chai_1.expect(collection.shelfUrl).to.equal(shelfLink.href);
    });
    it("extracts top-level links", function () {
        var aboutLink = factory.link({
            href: "about",
            rel: "about"
        });
        var termsLink = factory.link({
            href: "terms",
            rel: "terms-of-service"
        });
        var acquisitionFeed = factory.acquisitionFeed({
            id: "some id",
            entries: [],
            links: [aboutLink, termsLink]
        });
        var collection = OPDSDataAdapter_1.feedToCollection(acquisitionFeed, "");
        chai_1.expect(collection.links.length).to.equal(2);
        var urls = collection.links.map(function (link) { return link.url; }).sort();
        var types = collection.links.map(function (link) { return link.type; }).sort();
        chai_1.expect(urls).to.deep.equal(["about", "terms"]);
        chai_1.expect(types).to.deep.equal(["about", "terms-of-service"]);
    });
});
