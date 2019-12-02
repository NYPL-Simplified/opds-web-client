import {
  OPDSFeed,
  OPDSEntry,
  OPDSArtworkLink,
  AcquisitionFeed,
  OPDSCollectionLink,
  OPDSFacetLink,
  OPDSLink,
  SearchLink,
  CompleteEntryLink,
  OPDSCatalogRootLink,
  OPDSAcquisitionLink,
  OPDSShelfLink
} from "opds-feed-parser";
import {
  CollectionData,
  LaneData,
  BookData,
  LinkData,
  FacetGroupData,
  SearchData
} from "./interfaces";
import { resolve } from "url";

let sanitizeHtml;
const createDOMPurify = require("dompurify");
if (typeof window === "undefined") {
  // sanitization needs to work server-side,
  // so we use jsdom to build it a window object
  const jsdom = require("jsdom");
  const window = jsdom.jsdom("", {
    features: {
      FetchExternalResources: false, // disables resource loading over HTTP / filesystem
      ProcessExternalResources: false // do not execute JS within script blocks
    }
  }).defaultView;
  sanitizeHtml = createDOMPurify(window).sanitize;
} else {
  sanitizeHtml = createDOMPurify(window).sanitize;
}

/** Converts OPDS data into the internal representation used by components. */
export function adapter(
  data: OPDSFeed | OPDSEntry,
  url: string
): CollectionData | BookData {
  if (data instanceof OPDSFeed) {
    let collectionData = feedToCollection(data, url);
    return collectionData;
  } else if (data instanceof OPDSEntry) {
    let bookData = entryToBook(data, url);
    return bookData;
  } else {
    throw "parsed data must be OPDSFeed or OPDSEntry";
  }
}

export function entryToBook(entry: OPDSEntry, feedUrl: string): BookData {
  let authors = entry.authors.map(author => {
    return author.name;
  });

  let contributors = entry.contributors.map(contributor => {
    return contributor.name;
  });

  let imageUrl, imageThumbLink;
  let artworkLinks = entry.links.filter(link => {
    return link instanceof OPDSArtworkLink;
  });
  if (artworkLinks.length > 0) {
    imageThumbLink = artworkLinks.find(
      link => link.rel === "http://opds-spec.org/image/thumbnail"
    );
    if (imageThumbLink) {
      imageUrl = resolve(feedUrl, imageThumbLink.href);
    } else {
      console.log("WARNING: using possibly large image for " + entry.title);
      imageUrl = resolve(feedUrl, artworkLinks[0].href);
    }
  }

  let detailUrl;
  let detailLink = entry.links.find(link => link instanceof CompleteEntryLink);
  if (detailLink) {
    detailUrl = resolve(feedUrl, detailLink.href);
  }

  let categories = entry.categories
    .filter(category => !!category.label)
    .map(category => category.label);

  let openAccessLinks = entry.links
    .filter(link => {
      return (
        link instanceof OPDSAcquisitionLink &&
        link.rel === OPDSAcquisitionLink.OPEN_ACCESS_REL
      );
    })
    .map(link => {
      return {
        url: resolve(feedUrl, link.href),
        type: link.type
      };
    });

  let borrowUrl;
  let borrowLink = <OPDSAcquisitionLink>entry.links.find(link => {
    return (
      link instanceof OPDSAcquisitionLink &&
      link.rel === OPDSAcquisitionLink.BORROW_REL
    );
  });
  if (borrowLink) {
    borrowUrl = resolve(feedUrl, borrowLink.href);
  }

  let fulfillmentUrls;
  let fulfillmentType;
  let fulfillmentLinks = entry.links
    .filter(link => {
      return (
        link instanceof OPDSAcquisitionLink &&
        link.rel === OPDSAcquisitionLink.GENERIC_REL
      );
    })
    .map(link => {
      let indirectType;
      let indirects = (link as OPDSAcquisitionLink).indirectAcquisitions;

      if (indirects && indirects.length > 0) {
        indirectType = indirects[0].type;
      }

      return {
        url: resolve(feedUrl, link.href),
        type: link.type,
        indirectType
      };
    });

  let availability;
  let holds;
  let copies;
  let linkWithAvailability = <OPDSAcquisitionLink>entry.links.find(link => {
    return link instanceof OPDSAcquisitionLink && !!link.availability;
  });
  if (linkWithAvailability) {
    ({ availability, holds, copies } = linkWithAvailability);
  }

  return <BookData>{
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

function entryToLink(entry: OPDSEntry, feedUrl: string): LinkData {
  let href: string;
  let links = entry.links;
  if (links.length > 0) {
    href = resolve(feedUrl, links[0].href);
  }
  return <LinkData>{
    id: entry.id,
    text: entry.title,
    url: href
  };
}

function dedupeBooks(books: BookData[]): BookData[] {
  // using Map because it preserves key order
  let bookIndex = books.reduce((index, book) => {
    index.set(book.id, book);
    return index;
  }, new Map<any, BookData>());

  return Array.from(bookIndex.values());
}

function formatDate(inputDate: string): string {
  let monthNames = [
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

  let date = new Date(inputDate);
  let day = date.getUTCDate();
  let monthIndex = date.getUTCMonth();
  let month = monthNames[monthIndex];
  let year = date.getUTCFullYear();

  return `${month} ${day}, ${year}`;
}

function OPDSLinkToLinkData(feedUrl, link: OPDSLink = null) {
  if (!link || !link.href) {
    return null;
  }

  return {
    url: resolve(feedUrl, link.href),
    text: link.title,
    type: link.rel
  };
}

export function feedToCollection(
  feed: OPDSFeed,
  feedUrl: string
): CollectionData {
  let collection = <CollectionData>{
    id: feed.id,
    title: feed.title,
    url: feedUrl
  };
  let books: BookData[] = [];
  let navigationLinks: LinkData[] = [];
  let lanes: LaneData[] = [];
  let laneTitles = [];
  let laneIndex = [];
  let facetGroups: FacetGroupData[] = [];
  let search: SearchData;
  let nextPageUrl: string;
  let catalogRootLink: OPDSLink;
  let parentLink: OPDSLink;
  let shelfUrl: string;
  let links: OPDSLink[] = [];

  feed.entries.forEach(entry => {
    if (feed instanceof AcquisitionFeed) {
      let book = entryToBook(entry, feedUrl);
      let collectionLink: OPDSCollectionLink = entry.links.find(
        link => link instanceof OPDSCollectionLink
      );
      if (collectionLink) {
        let { title, href } = collectionLink;

        if (laneIndex[title]) {
          laneIndex[title].books.push(book);
        } else {
          laneIndex[title] = {
            title,
            url: resolve(feedUrl, href),
            books: [book]
          };
          // use array of titles to preserve lane order
          laneTitles.push(title);
        }
      } else {
        books.push(book);
      }
    } else {
      let link = entryToLink(entry, feedUrl);
      navigationLinks.push(link);
    }
  });

  lanes = laneTitles.reduce((result, title) => {
    let lane = laneIndex[title];
    lane.books = dedupeBooks(lane.books);
    result.push(lane);
    return result;
  }, lanes);

  let facetLinks = [];
  if (feed.links) {
    facetLinks = feed.links.filter(link => {
      return link instanceof OPDSFacetLink;
    });

    let searchLink = feed.links.find(link => {
      return link instanceof SearchLink;
    });
    if (searchLink) {
      search = { url: resolve(feedUrl, searchLink.href) };
    }

    let nextPageLink = feed.links.find(link => {
      return link.rel === "next";
    });
    if (nextPageLink) {
      nextPageUrl = resolve(feedUrl, nextPageLink.href);
    }

    catalogRootLink = feed.links.find(link => {
      return link instanceof OPDSCatalogRootLink;
    });

    parentLink = feed.links.find(link => link.rel === "up");

    let shelfLink = feed.links.find(link => link instanceof OPDSShelfLink);
    if (shelfLink) {
      shelfUrl = shelfLink.href;
    }

    links = feed.links;
  }

  facetGroups = facetLinks.reduce((result, link) => {
    let groupLabel = link.facetGroup;
    let label = link.title;
    let href = resolve(feedUrl, link.href);
    let active = link.activeFacet;
    let facet = { label, href, active };
    let newResult = [];
    let foundGroup = false;
    result.forEach(group => {
      if (group.label === groupLabel) {
        let facets = group.facets.concat(facet);
        newResult.push({ label: groupLabel, facets });
        foundGroup = true;
      } else {
        newResult.push(group);
      }
    });
    if (!foundGroup) {
      let facets = [facet];
      newResult.push({ label: groupLabel, facets });
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
  collection.links = links.map(link => OPDSLinkToLinkData(feedUrl, link));
  collection.raw = feed.unparsed;
  Object.freeze(collection);
  return collection;
}
