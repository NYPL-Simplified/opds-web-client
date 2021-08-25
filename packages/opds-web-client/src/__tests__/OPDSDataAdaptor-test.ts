import { expect } from "chai";

import {
  OPDSCollectionLink,
  OPDSAcquisitionLink,
  OPDSShelfLink
} from "opds-feed-parser";
import * as factory from "./OPDSFactory";
import { feedToCollection } from "../OPDSDataAdapter";
const sanitizeHtml = require("dompurify").sanitize;

describe("OPDSDataAdapter", () => {
  it("extracts book info", () => {
    let largeImageLink = factory.artworkLink({
      href: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg",
      rel: "http://opds-spec.org/image"
    });

    let thumbImageLink = factory.artworkLink({
      href: "http://example.com/testthumb.jpg",
      rel: "http://opds-spec.org/image/thumbnail"
    });

    let openAccessLink = factory.acquisitionLink({
      href: "http://example.com/open.epub",
      rel: OPDSAcquisitionLink.OPEN_ACCESS_REL
    });

    let borrowLink = factory.acquisitionLink({
      href: "http://example.com/borrow",
      rel: OPDSAcquisitionLink.BORROW_REL,
      availability: { availability: "unavailable" },
      holds: { total: 20, position: 5 },
      copies: { total: 2, available: 0 }
    });

    let fulfillmentLink = factory.acquisitionLink({
      href: "http://example.com/fulfill",
      rel: OPDSAcquisitionLink.GENERIC_REL,
      type: "application/atom+xml;type=entry;profile=opds-catalog",
      indirectAcquisitions: [
        {
          type:
            "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media"
        }
      ]
    });

    let collectionLink = factory.collectionLink({
      href: "collection%20url",
      rel: OPDSCollectionLink.REL,
      title: "collection title"
    });

    let entry = factory.entry({
      id: "urn:librarysimplified.org/terms/id/3M%20ID/crrmnr9",
      title: "The Mayan Secrets",
      authors: [
        factory.contributor({ name: "Clive Cussler" }),
        factory.contributor({ name: "Thomas Perry" })
      ],
      contributors: [factory.contributor({ name: "contributor" })],
      subtitle: "A Sam and Remi Fargo Adventure",
      summary: factory.summary({
        content:
          "&lt;b&gt;Sam and Remi Fargo race for treasure&#8212;and survival&#8212;in this lightning-paced new adventure from #1&lt;i&gt; New York Times&lt;/i&gt; bestselling author Clive Cussler.&lt;/b&gt;&lt;br /&gt;&lt;br /&gt;Husband-and-wife team Sam and Remi Fargo are in Mexico when they come upon a remarkable discovery&#8212;the mummified remainsof a man clutching an ancient sealed pot. Within the pot is a Mayan book larger than any known before.&lt;br /&gt;&lt;br /&gt;The book contains astonishing information about the Mayans, their cities, and about mankind itself. The secrets are so powerful that some people would do anything to possess them&#8212;as the Fargos are about to find out. Many men and women are going to die for that book.<script>alert('danger!');</script>"
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

    let acquisitionFeed = factory.acquisitionFeed({
      id: "some id",
      entries: [entry],
      unparsed: "unparsed data"
    });

    let collection = feedToCollection(acquisitionFeed, "http://test-url.com");
    expect(collection.books.length).to.equal(0);
    expect(collection.lanes.length).to.equal(1);
    expect(collection.lanes[0].url).to.equal(collectionLink.href);
    expect(collection.raw).to.equal("unparsed data");

    let book = collection.lanes[0].books[0];

    expect(book.id).to.equal(entry.id);
    expect(book.title).to.equal(entry.title);
    expect(book.authors?.length).to.equal(2);
    expect(book.authors?.[0]).to.equal(entry.authors[0].name);
    expect(book.authors?.[1]).to.equal(entry.authors[1].name);
    expect(book.contributors?.length).to.equal(1);
    expect(book.contributors?.[0]).to.equal(entry.contributors[0].name);
    expect(book.series?.name).to.equal(entry.series.name);
    expect(book.series?.position).to.equal(entry.series.position);
    expect(book.subtitle).to.equal(entry.subtitle);
    expect(book.summary).to.equal(sanitizeHtml(entry.summary.content));
    expect(book.summary).to.contain(
      "Many men and women are going to die for that book."
    );
    expect(book.summary).not.to.contain("script");
    expect(book.summary).not.to.contain("danger");
    expect(book.categories?.length).to.equal(2);
    expect(book.categories).to.contain("label");
    expect(book.categories).to.contain("label 2");
    expect(book.imageUrl).to.equal(thumbImageLink.href);
    expect(book.publisher).to.equal("Fake Publisher");
    expect(book.published).to.equal("June 8, 2014");
    expect(book.language).to.equal("en");
    expect(book.openAccessLinks?.[0].url).to.equal(openAccessLink.href);
    expect(book.borrowUrl).to.equal(borrowLink.href);
    expect(book.allBorrowLinks?.[0].url).to.equal(borrowLink.href);
    expect(book.fulfillmentLinks?.[0].url).to.equal(fulfillmentLink.href);
    expect(book.fulfillmentLinks?.[0].type).to.equal(fulfillmentLink.type);
    expect(book.fulfillmentLinks?.[0].indirectType).to.equal(
      fulfillmentLink.indirectAcquisitions[0].type
    );
    expect(book.availability).to.equal(borrowLink.availability);
    expect(book.holds).to.equal(borrowLink.holds);
    expect(book.copies).to.equal(borrowLink.copies);
  });

  it("extracts navigation link info", () => {
    let navigationLink = factory.link({
      href: "href"
    });

    let linkEntry = factory.entry({
      id: "feed.xml",
      title: "Feed",
      links: [navigationLink]
    });

    let navigationFeed = factory.navigationFeed({
      id: "some id",
      entries: [linkEntry]
    });

    let collection = feedToCollection(navigationFeed, "http://test-url.com");
    expect(collection.navigationLinks.length).to.equal(1);
    let link = collection.navigationLinks[0];
    expect(link.id).to.equal(linkEntry.id);
    expect(link.text).to.equal(linkEntry.title);
    expect(link.url).to.equal(navigationLink.href);
  });

  it("extracts facet groups", () => {
    let facetLinks = [
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

    let acquisitionFeed = factory.acquisitionFeed({
      id: "some id",
      entries: [],
      links: facetLinks
    });

    let collection = feedToCollection(acquisitionFeed, "http://test-url.com");
    expect(collection.facetGroups?.length).to.equal(2);

    let groupA = collection.facetGroups?.[0];
    expect(groupA?.label).to.equal("group A");
    expect(groupA?.facets.length).to.equal(2);

    let groupB = collection.facetGroups?.[1];
    expect(groupB?.label).to.equal("group B");
    expect(groupB?.facets.length).to.equal(1);

    let facet1 = groupA?.facets[0];
    expect(facet1?.label).to.equal("title 1");
    expect(facet1?.active).to.be.ok;
    expect(facet1?.href).to.equal("href1");

    let facet2 = groupB?.facets[0];
    expect(facet2?.label).to.equal("title 2");
    expect(facet2?.active).not.to.be.ok;
    expect(facet2?.href).to.equal("href2");

    let facet3 = groupA?.facets[1];
    expect(facet3?.label).to.equal("title 3");
    expect(facet3?.active).not.to.be.ok;
    expect(facet3?.href).to.equal("href3");
  });

  it("extracts search link", () => {
    let searchLink = factory.searchLink({
      href: "search%20url"
    });

    let navigationFeed = factory.navigationFeed({
      id: "some id",
      entries: [],
      links: [searchLink]
    });

    let collection = feedToCollection(navigationFeed, "http://test-url.com");
    expect(collection.search).to.be.ok;
    expect(collection.search?.url).to.equal(searchLink.href);
  });

  it("extracts next page url", () => {
    let nextLink = factory.link({
      href: "href",
      rel: "next"
    });

    let acquisitionFeed = factory.acquisitionFeed({
      id: "some id",
      entries: [],
      links: [nextLink]
    });

    let collection = feedToCollection(acquisitionFeed, "http://test-url.com");
    expect(collection.nextPageUrl).to.be.ok;
    expect(collection.nextPageUrl).to.equal("href");
  });

  it("extracts shelf url", () => {
    let shelfLink = factory.shelfLink({
      href: "loans",
      rel: OPDSShelfLink.REL
    });

    let acquisitionFeed = factory.acquisitionFeed({
      id: "some id",
      entries: [],
      links: [shelfLink]
    });

    let collection = feedToCollection(acquisitionFeed, "http://test-url.com");
    expect(collection.shelfUrl).to.equal(shelfLink.href);
  });

  it("extracts top-level links", () => {
    let aboutLink = factory.link({
      href: "about",
      rel: "about"
    });
    let termsLink = factory.link({
      href: "terms",
      rel: "terms-of-service"
    });

    let acquisitionFeed = factory.acquisitionFeed({
      id: "some id",
      entries: [],
      links: [aboutLink, termsLink]
    });

    let collection = feedToCollection(acquisitionFeed, "http://test-url.com");
    expect(collection.links?.length).to.equal(2);
    let urls = collection.links?.map(link => link.url).sort();
    let types = collection.links?.map(link => link.type).sort();
    expect(urls).to.deep.equal(["about", "terms"]);
    expect(types).to.deep.equal(["about", "terms-of-service"]);
  });
});
