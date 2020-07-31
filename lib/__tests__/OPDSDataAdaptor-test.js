"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var opds_feed_parser_1 = require("opds-feed-parser");
var factory = require("./OPDSFactory");
var OPDSDataAdapter_1 = require("../OPDSDataAdapter");
var sanitizeHtml = require("dompurify").sanitize;
describe("OPDSDataAdapter", function () {
    it("extracts book info", function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var largeImageLink = factory.artworkLink({
            href: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
            rel: "http://opds-spec.org/image"
        });
        var thumbImageLink = factory.artworkLink({
            href: "http://example.com/testthumb.jpg",
            rel: "http://opds-spec.org/image/thumbnail"
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
            indirectAcquisitions: [
                {
                    type: "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media"
                }
            ]
        });
        var collectionLink = factory.collectionLink({
            href: "collection%20url",
            rel: opds_feed_parser_1.OPDSCollectionLink.REL,
            title: "collection title"
        });
        var entry = factory.entry({
            id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
            title: "The Mayan Secrets",
            authors: [
                factory.contributor({ name: "Clive Cussler" }),
                factory.contributor({ name: "Thomas Perry" })
            ],
            contributors: [factory.contributor({ name: "contributor" })],
            subtitle: "A Sam and Remi Fargo Adventure",
            summary: factory.summary({
                content: "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.<script>alert('danger!');</script>"
            }),
            categories: [
                factory.category({ label: "label" }),
                factory.category({ term: "no label" }),
                factory.category({ label: "label 2" })
            ],
            links: [
                largeImageLink,
                thumbImageLink,
                openAccessLink,
                borrowLink,
                fulfillmentLink,
                collectionLink
            ],
            issued: "2014-06-08",
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
        var collection = OPDSDataAdapter_1.feedToCollection(acquisitionFeed, "http://test-url.com");
        chai_1.expect(collection.books.length).to.equal(0);
        chai_1.expect(collection.lanes.length).to.equal(1);
        chai_1.expect(collection.lanes[0].url).to.equal("http://test-url.com/" + collectionLink.href);
        chai_1.expect(collection.raw).to.equal("unparsed data");
        var book = collection.lanes[0].books[0];
        chai_1.expect(book.id).to.equal(entry.id);
        chai_1.expect(book.title).to.equal(entry.title);
        chai_1.expect((_a = book.authors) === null || _a === void 0 ? void 0 : _a.length).to.equal(2);
        chai_1.expect((_b = book.authors) === null || _b === void 0 ? void 0 : _b[0]).to.equal(entry.authors[0].name);
        chai_1.expect((_c = book.authors) === null || _c === void 0 ? void 0 : _c[1]).to.equal(entry.authors[1].name);
        chai_1.expect((_d = book.contributors) === null || _d === void 0 ? void 0 : _d.length).to.equal(1);
        chai_1.expect((_e = book.contributors) === null || _e === void 0 ? void 0 : _e[0]).to.equal(entry.contributors[0].name);
        chai_1.expect((_f = book.series) === null || _f === void 0 ? void 0 : _f.name).to.equal(entry.series.name);
        chai_1.expect((_g = book.series) === null || _g === void 0 ? void 0 : _g.position).to.equal(entry.series.position);
        chai_1.expect(book.subtitle).to.equal(entry.subtitle);
        chai_1.expect(book.summary).to.equal(sanitizeHtml(entry.summary.content));
        chai_1.expect(book.summary).to.contain("Many men and women are going to die for that book.");
        chai_1.expect(book.summary).not.to.contain("script");
        chai_1.expect(book.summary).not.to.contain("danger");
        chai_1.expect((_h = book.categories) === null || _h === void 0 ? void 0 : _h.length).to.equal(2);
        chai_1.expect(book.categories).to.contain("label");
        chai_1.expect(book.categories).to.contain("label 2");
        chai_1.expect(book.imageUrl).to.equal(thumbImageLink.href);
        chai_1.expect(book.publisher).to.equal("Fake Publisher");
        chai_1.expect(book.published).to.equal("June 8, 2014");
        chai_1.expect(book.language).to.equal("en");
        chai_1.expect((_j = book.openAccessLinks) === null || _j === void 0 ? void 0 : _j[0].url).to.equal(openAccessLink.href);
        chai_1.expect(book.borrowUrl).to.equal(borrowLink.href);
        chai_1.expect((_k = book.fulfillmentLinks) === null || _k === void 0 ? void 0 : _k[0].url).to.equal(fulfillmentLink.href);
        chai_1.expect((_l = book.fulfillmentLinks) === null || _l === void 0 ? void 0 : _l[0].type).to.equal(fulfillmentLink.type);
        chai_1.expect((_m = book.fulfillmentLinks) === null || _m === void 0 ? void 0 : _m[0].indirectType).to.equal(fulfillmentLink.indirectAcquisitions[0].type);
        chai_1.expect(book.availability).to.equal(borrowLink.availability);
        chai_1.expect(book.holds).to.equal(borrowLink.holds);
        chai_1.expect(book.copies).to.equal(borrowLink.copies);
    });
    it("extracts navigation link info", function () {
        var navigationLink = factory.link({
            href: "href"
        });
        var linkEntry = factory.entry({
            id: "feed.xml",
            title: "Feed",
            links: [navigationLink]
        });
        var navigationFeed = factory.navigationFeed({
            id: "some id",
            entries: [linkEntry]
        });
        var collection = OPDSDataAdapter_1.feedToCollection(navigationFeed, "http://test-url.com");
        chai_1.expect(collection.navigationLinks.length).to.equal(1);
        var link = collection.navigationLinks[0];
        chai_1.expect(link.id).to.equal(linkEntry.id);
        chai_1.expect(link.text).to.equal(linkEntry.title);
        chai_1.expect(link.url).to.equal("http://test-url.com/" + navigationLink.href);
    });
    it("extracts facet groups", function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
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
            links: facetLinks
        });
        var collection = OPDSDataAdapter_1.feedToCollection(acquisitionFeed, "http://test-url.com");
        chai_1.expect((_a = collection.facetGroups) === null || _a === void 0 ? void 0 : _a.length).to.equal(2);
        var groupA = (_b = collection.facetGroups) === null || _b === void 0 ? void 0 : _b[0];
        chai_1.expect((_c = groupA) === null || _c === void 0 ? void 0 : _c.label).to.equal("group A");
        chai_1.expect((_d = groupA) === null || _d === void 0 ? void 0 : _d.facets.length).to.equal(2);
        var groupB = (_e = collection.facetGroups) === null || _e === void 0 ? void 0 : _e[1];
        chai_1.expect((_f = groupB) === null || _f === void 0 ? void 0 : _f.label).to.equal("group B");
        chai_1.expect((_g = groupB) === null || _g === void 0 ? void 0 : _g.facets.length).to.equal(1);
        var facet1 = (_h = groupA) === null || _h === void 0 ? void 0 : _h.facets[0];
        chai_1.expect((_j = facet1) === null || _j === void 0 ? void 0 : _j.label).to.equal("title 1");
        chai_1.expect((_k = facet1) === null || _k === void 0 ? void 0 : _k.active).to.be.ok;
        chai_1.expect((_l = facet1) === null || _l === void 0 ? void 0 : _l.href).to.equal("http://test-url.com/href1");
        var facet2 = (_m = groupB) === null || _m === void 0 ? void 0 : _m.facets[0];
        chai_1.expect((_o = facet2) === null || _o === void 0 ? void 0 : _o.label).to.equal("title 2");
        chai_1.expect((_p = facet2) === null || _p === void 0 ? void 0 : _p.active).not.to.be.ok;
        chai_1.expect((_q = facet2) === null || _q === void 0 ? void 0 : _q.href).to.equal("http://test-url.com/href2");
        var facet3 = (_r = groupA) === null || _r === void 0 ? void 0 : _r.facets[1];
        chai_1.expect((_s = facet3) === null || _s === void 0 ? void 0 : _s.label).to.equal("title 3");
        chai_1.expect((_t = facet3) === null || _t === void 0 ? void 0 : _t.active).not.to.be.ok;
        chai_1.expect((_u = facet3) === null || _u === void 0 ? void 0 : _u.href).to.equal("http://test-url.com/href3");
    });
    it("extracts search link", function () {
        var _a;
        var searchLink = factory.searchLink({
            href: "search%20url"
        });
        var navigationFeed = factory.navigationFeed({
            id: "some id",
            entries: [],
            links: [searchLink]
        });
        var collection = OPDSDataAdapter_1.feedToCollection(navigationFeed, "http://test-url.com");
        chai_1.expect(collection.search).to.be.ok;
        chai_1.expect((_a = collection.search) === null || _a === void 0 ? void 0 : _a.url).to.equal("http://test-url.com/" + searchLink.href);
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
        var collection = OPDSDataAdapter_1.feedToCollection(acquisitionFeed, "http://test-url.com");
        chai_1.expect(collection.nextPageUrl).to.be.ok;
        chai_1.expect(collection.nextPageUrl).to.equal("http://test-url.com/href");
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
        var collection = OPDSDataAdapter_1.feedToCollection(acquisitionFeed, "http://test-url.com");
        chai_1.expect(collection.shelfUrl).to.equal(shelfLink.href);
    });
    it("extracts top-level links", function () {
        var _a, _b, _c;
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
        var collection = OPDSDataAdapter_1.feedToCollection(acquisitionFeed, "http://test-url.com");
        chai_1.expect((_a = collection.links) === null || _a === void 0 ? void 0 : _a.length).to.equal(2);
        var urls = (_b = collection.links) === null || _b === void 0 ? void 0 : _b.map(function (link) { return link.url; }).sort();
        var types = (_c = collection.links) === null || _c === void 0 ? void 0 : _c.map(function (link) { return link.type; }).sort();
        chai_1.expect(urls).to.deep.equal([
            "http://test-url.com/about",
            "http://test-url.com/terms"
        ]);
        chai_1.expect(types).to.deep.equal(["about", "terms-of-service"]);
    });
});
