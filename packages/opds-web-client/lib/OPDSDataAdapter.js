"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var opds_feed_parser_1 = require("opds-feed-parser");
var url_1 = require("url");
var sanitizeHtml;
var createDOMPurify = require("dompurify");
if (typeof window === "undefined") {
    // sanitization needs to work server-side,
    // so we use jsdom to build it a window object
    var jsdom = require("jsdom");
    var window_1 = jsdom.jsdom("", {
        features: {
            FetchExternalResources: false,
            ProcessExternalResources: false // do not execute JS within script blocks
        }
    }).defaultView;
    sanitizeHtml = createDOMPurify(window_1).sanitize;
}
else {
    sanitizeHtml = createDOMPurify(window).sanitize;
}
/** Converts OPDS data into the internal representation used by components. */
function adapter(data, url) {
    if (data instanceof opds_feed_parser_1.OPDSFeed) {
        var collectionData = feedToCollection(data, url);
        return collectionData;
    }
    else if (data instanceof opds_feed_parser_1.OPDSEntry) {
        var bookData = entryToBook(data, url);
        return bookData;
    }
    else {
        throw ("parsed data must be OPDSFeed or OPDSEntry");
    }
}
exports.adapter = adapter;
function entryToBook(entry, feedUrl) {
    var authors = entry.authors.map(function (author) {
        return author.name;
    });
    var contributors = entry.contributors.map(function (contributor) {
        return contributor.name;
    });
    var imageUrl, imageThumbLink;
    var artworkLinks = entry.links.filter(function (link) {
        return (link instanceof opds_feed_parser_1.OPDSArtworkLink);
    });
    if (artworkLinks.length > 0) {
        imageThumbLink = artworkLinks.find(function (link) { return link.rel === "http://opds-spec.org/image/thumbnail"; });
        if (imageThumbLink) {
            imageUrl = url_1.resolve(feedUrl, imageThumbLink.href);
        }
        else {
            console.log("WARNING: using possibly large image for " + entry.title);
            imageUrl = url_1.resolve(feedUrl, artworkLinks[0].href);
        }
    }
    var detailUrl;
    var detailLink = entry.links.find(function (link) { return link instanceof opds_feed_parser_1.CompleteEntryLink; });
    if (detailLink) {
        detailUrl = url_1.resolve(feedUrl, detailLink.href);
    }
    var categories = entry.categories.filter(function (category) { return !!category.label; }).map(function (category) { return category.label; });
    var openAccessLinks = entry.links.filter(function (link) {
        return link instanceof opds_feed_parser_1.OPDSAcquisitionLink &&
            link.rel === opds_feed_parser_1.OPDSAcquisitionLink.OPEN_ACCESS_REL;
    }).map(function (link) {
        return {
            url: url_1.resolve(feedUrl, link.href),
            type: link.type
        };
    });
    var borrowUrl;
    var borrowLink = entry.links.find(function (link) {
        return link instanceof opds_feed_parser_1.OPDSAcquisitionLink && link.rel === opds_feed_parser_1.OPDSAcquisitionLink.BORROW_REL;
    });
    if (borrowLink) {
        borrowUrl = url_1.resolve(feedUrl, borrowLink.href);
    }
    var fulfillmentUrls;
    var fulfillmentType;
    var fulfillmentLinks = entry.links.filter(function (link) {
        return link instanceof opds_feed_parser_1.OPDSAcquisitionLink &&
            link.rel === opds_feed_parser_1.OPDSAcquisitionLink.GENERIC_REL;
    }).map(function (link) {
        var indirectType;
        var indirects = link.indirectAcquisitions;
        if (indirects && indirects.length > 0) {
            indirectType = indirects[0].type;
        }
        return {
            url: url_1.resolve(feedUrl, link.href),
            type: link.type,
            indirectType: indirectType
        };
    });
    var availability;
    var holds;
    var copies;
    var linkWithAvailability = entry.links.find(function (link) {
        return link instanceof opds_feed_parser_1.OPDSAcquisitionLink && !!link.availability;
    });
    if (linkWithAvailability) {
        (availability = linkWithAvailability.availability, holds = linkWithAvailability.holds, copies = linkWithAvailability.copies);
    }
    return {
        id: entry.id,
        title: entry.title,
        series: entry.series,
        authors: authors,
        contributors: contributors,
        summary: entry.summary.content && sanitizeHtml(entry.summary.content),
        imageUrl: imageUrl,
        openAccessLinks: openAccessLinks,
        borrowUrl: borrowUrl,
        fulfillmentLinks: fulfillmentLinks,
        availability: availability,
        holds: holds,
        copies: copies,
        publisher: entry.publisher,
        published: entry.issued && formatDate(entry.issued),
        categories: categories,
        language: entry.language,
        url: detailUrl,
        raw: entry.unparsed
    };
}
exports.entryToBook = entryToBook;
function entryToLink(entry, feedUrl) {
    var href;
    var links = entry.links;
    if (links.length > 0) {
        href = url_1.resolve(feedUrl, links[0].href);
    }
    return {
        id: entry.id,
        text: entry.title,
        url: href
    };
}
function dedupeBooks(books) {
    // using Map because it preserves key order
    var bookIndex = books.reduce(function (index, book) {
        index.set(book.id, book);
        return index;
    }, new Map());
    return Array.from(bookIndex.values());
}
function formatDate(inputDate) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    var date = new Date(inputDate);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var month = monthNames[monthIndex];
    var year = date.getFullYear();
    return month + " " + day + ", " + year;
}
function OPDSLinkToLinkData(feedUrl, link) {
    if (link === void 0) { link = null; }
    if (!link || !link.href) {
        return null;
    }
    return {
        url: url_1.resolve(feedUrl, link.href),
        text: link.title,
        type: link.rel
    };
}
function feedToCollection(feed, feedUrl) {
    var collection = {
        id: feed.id,
        title: feed.title,
        url: feedUrl
    };
    var books = [];
    var navigationLinks = [];
    var lanes = [];
    var laneTitles = [];
    var laneIndex = [];
    var facetGroups = [];
    var search;
    var nextPageUrl;
    var catalogRootLink;
    var parentLink;
    var shelfUrl;
    var links = [];
    feed.entries.forEach(function (entry) {
        if (feed instanceof opds_feed_parser_1.AcquisitionFeed) {
            var book = entryToBook(entry, feedUrl);
            var collectionLink = entry.links.find(function (link) { return link instanceof opds_feed_parser_1.OPDSCollectionLink; });
            if (collectionLink) {
                var title = collectionLink.title, href = collectionLink.href;
                if (laneIndex[title]) {
                    laneIndex[title].books.push(book);
                }
                else {
                    laneIndex[title] = { title: title, url: url_1.resolve(feedUrl, href), books: [book] };
                    // use array of titles to preserve lane order
                    laneTitles.push(title);
                }
            }
            else {
                books.push(book);
            }
        }
        else {
            var link = entryToLink(entry, feedUrl);
            navigationLinks.push(link);
        }
    });
    lanes = laneTitles.reduce(function (result, title) {
        var lane = laneIndex[title];
        lane.books = dedupeBooks(lane.books);
        result.push(lane);
        return result;
    }, lanes);
    var facetLinks = [];
    if (feed.links) {
        facetLinks = feed.links.filter(function (link) {
            return (link instanceof opds_feed_parser_1.OPDSFacetLink);
        });
        var searchLink = feed.links.find(function (link) {
            return (link instanceof opds_feed_parser_1.SearchLink);
        });
        if (searchLink) {
            search = { url: url_1.resolve(feedUrl, searchLink.href) };
        }
        var nextPageLink = feed.links.find(function (link) {
            return (link.rel === "next");
        });
        if (nextPageLink) {
            nextPageUrl = url_1.resolve(feedUrl, nextPageLink.href);
        }
        catalogRootLink = feed.links.find(function (link) {
            return (link instanceof opds_feed_parser_1.OPDSCatalogRootLink);
        });
        parentLink = feed.links.find(function (link) { return link.rel === "up"; });
        var shelfLink = feed.links.find(function (link) { return link instanceof opds_feed_parser_1.OPDSShelfLink; });
        if (shelfLink) {
            shelfUrl = shelfLink.href;
        }
        links = feed.links;
    }
    facetGroups = facetLinks.reduce(function (result, link) {
        var groupLabel = link.facetGroup;
        var label = link.title;
        var href = url_1.resolve(feedUrl, link.href);
        var active = link.activeFacet;
        var facet = { label: label, href: href, active: active };
        var newResult = [];
        var foundGroup = false;
        result.forEach(function (group) {
            if (group.label === groupLabel) {
                var facets = group.facets.concat(facet);
                newResult.push({ label: groupLabel, facets: facets });
                foundGroup = true;
            }
            else {
                newResult.push(group);
            }
        });
        if (!foundGroup) {
            var facets = [facet];
            newResult.push({ label: groupLabel, facets: facets });
        }
        return newResult;
    }, []);
    collection.lanes = lanes;
    collection.navigationLinks = navigationLinks;
    collection.books = dedupeBooks(books);
    collection.facetGroups = facetGroups;
    collection.search = search;
    collection.nextPageUrl = nextPageUrl;
    collection.catalogRootLink = OPDSLinkToLinkData(feedUrl, catalogRootLink);
    collection.parentLink = OPDSLinkToLinkData(feedUrl, parentLink);
    collection.shelfUrl = shelfUrl;
    collection.links = links.map(function (link) { return OPDSLinkToLinkData(feedUrl, link); });
    collection.raw = feed.unparsed;
    Object.freeze(collection);
    return collection;
}
exports.feedToCollection = feedToCollection;
