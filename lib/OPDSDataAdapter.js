"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var opds_feed_parser_1 = require("opds-feed-parser");
var resolve = function (base, relative) { return new URL(relative, base).toString(); };
var sanitizeHtml;
var createDOMPurify = require("dompurify");
if (typeof window === "undefined") {
    // sanitization needs to work server-side,
    // so we use jsdom to build it a window object
    var JSDOM = require("jsdom").JSDOM;
    var jsdom = new JSDOM("<!doctype html><html><body></body></html>", {
        url: "http://localhost",
        FetchExternalResources: false,
        ProcessExternalResources: false
    });
    var window_1 = jsdom.window;
    var defaultView = window_1.defaultView;
    sanitizeHtml = createDOMPurify(defaultView).sanitize;
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
        throw "parsed data must be OPDSFeed or OPDSEntry";
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
        return link instanceof opds_feed_parser_1.OPDSArtworkLink;
    });
    if (artworkLinks.length > 0) {
        imageThumbLink = artworkLinks.find(function (link) { return link.rel === "http://opds-spec.org/image/thumbnail"; });
        if (imageThumbLink) {
            imageUrl = resolve(feedUrl, imageThumbLink.href);
        }
        else {
            console.log("WARNING: using possibly large image for " + entry.title);
            imageUrl = resolve(feedUrl, artworkLinks[0].href);
        }
    }
    var detailUrl;
    var detailLink = entry.links.find(function (link) { return link instanceof opds_feed_parser_1.CompleteEntryLink; });
    if (detailLink) {
        detailUrl = resolve(feedUrl, detailLink.href);
    }
    var categories = entry.categories
        .filter(function (category) { return !!category.label; })
        .map(function (category) { return category.label; });
    var openAccessLinks = entry.links
        .filter(function (link) {
        return (link instanceof opds_feed_parser_1.OPDSAcquisitionLink &&
            link.rel === opds_feed_parser_1.OPDSAcquisitionLink.OPEN_ACCESS_REL);
    })
        .map(function (link) {
        return {
            url: resolve(feedUrl, link.href),
            type: link.type
        };
    });
    var borrowUrl;
    var borrowLink = entry.links.find(function (link) {
        return (link instanceof opds_feed_parser_1.OPDSAcquisitionLink &&
            link.rel === opds_feed_parser_1.OPDSAcquisitionLink.BORROW_REL);
    });
    if (borrowLink) {
        borrowUrl = resolve(feedUrl, borrowLink.href);
    }
    var fulfillmentUrls;
    var fulfillmentType;
    var fulfillmentLinks = entry.links
        .filter(function (link) {
        return (link instanceof opds_feed_parser_1.OPDSAcquisitionLink &&
            link.rel === opds_feed_parser_1.OPDSAcquisitionLink.GENERIC_REL);
    })
        .map(function (link) {
        var indirectType;
        var indirects = link.indirectAcquisitions;
        if (indirects && indirects.length > 0) {
            indirectType = indirects[0].type;
        }
        return {
            url: resolve(feedUrl, link.href),
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
        subtitle: entry.subtitle,
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
    var links = entry.links;
    if (links.length > 0) {
        var href = resolve(feedUrl, links[0].href);
        return {
            id: entry.id,
            text: entry.title,
            url: href
        };
    }
    console.error("Attempting to create Link with undefined url. entry is: ", entry);
    return null;
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
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    var date = new Date(inputDate);
    var day = date.getUTCDate();
    var monthIndex = date.getUTCMonth();
    var month = monthNames[monthIndex];
    var year = date.getUTCFullYear();
    return month + " " + day + ", " + year;
}
function OPDSLinkToLinkData(feedUrl, link) {
    if (link === void 0) { link = null; }
    if (!link || !link.href) {
        return null;
    }
    return {
        url: resolve(feedUrl, link.href),
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
    var search = undefined;
    var nextPageUrl = undefined;
    var catalogRootLink;
    var parentLink;
    var shelfUrl = undefined;
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
                    laneIndex[title] = {
                        title: title,
                        url: resolve(feedUrl, href),
                        books: [book]
                    };
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
            if (link)
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
            return link instanceof opds_feed_parser_1.OPDSFacetLink;
        });
        var searchLink = feed.links.find(function (link) {
            return link instanceof opds_feed_parser_1.SearchLink;
        });
        if (searchLink) {
            search = { url: resolve(feedUrl, searchLink.href) };
        }
        var nextPageLink = feed.links.find(function (link) {
            return link.rel === "next";
        });
        if (nextPageLink) {
            nextPageUrl = resolve(feedUrl, nextPageLink.href);
        }
        catalogRootLink = feed.links.find(function (link) {
            return link instanceof opds_feed_parser_1.OPDSCatalogRootLink;
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
        var href = resolve(feedUrl, link.href);
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
    function notNull(value) {
        return value !== null && value !== undefined;
    }
    collection.links = links
        .map(function (link) { return OPDSLinkToLinkData(feedUrl, link); })
        // we have to filter out the null values in order for typescript to accept this
        .filter(notNull);
    collection.raw = feed.unparsed;
    Object.freeze(collection);
    return collection;
}
exports.feedToCollection = feedToCollection;
