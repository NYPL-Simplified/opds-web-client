import {
  OPDSFeed,
  OPDSEntry,
  OPDSArtworkLink,
  AcquisitionFeed,
  OPDSCollectionLink,
  OPDSFacetLink,
  SearchLink,
  CompleteEntryLink
} from "opds-feed-parser";
import * as url from "url";
const sanitizeHtml = require("sanitize-html");

export function entryToBook(entry: any, feedUrl: string): BookData {
  let authors = entry.authors.map((author) => {
    return author.name;
  });

  let imageUrl, imageThumbLink;
  let artworkLinks = entry.links.filter((link) => {
    return (link instanceof OPDSArtworkLink);
  });
  if (artworkLinks.length > 0) {
    imageThumbLink = artworkLinks.find(link => link.rel === "http://opds-spec.org/image/thumbnail");
    if (imageThumbLink) {
      imageUrl = url.resolve(feedUrl, imageThumbLink.href);
    } else {
      console.log("WARNING: using possibly large image for " + entry.title);
      imageUrl = url.resolve(feedUrl, artworkLinks[0].href);
    }
  }

  let detailUrl;
  let detailLink = entry.links.find(link => link instanceof CompleteEntryLink);
  if (detailLink) {
    detailUrl = detailLink.href;
  }

  return <BookData>{
    id: entry.id,
    title: entry.title,
    authors: authors,
    summary: sanitizeHtml(entry.summary.content),
    imageUrl: imageUrl,
    publisher: entry.publisher,
    published: formatDate(entry.published),
    url: detailUrl
  };
}

function entryToLink(entry: OPDSEntry, feedUrl: string): LinkData {
  let href: string;
  let links = entry.links;
  if (links.length > 0) {
     href = url.resolve(feedUrl, links[0].href);
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
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  let date = new Date(inputDate);
  let day = date.getDate();
  let monthIndex = date.getMonth();
  let month = monthNames[monthIndex];
  let year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

export function feedToCollection(feed: OPDSFeed, feedUrl: string): CollectionData {
  let collection = <CollectionData>{
    id: feed.id,
    title: feed.title,
    url: feedUrl
  };
  let books: BookData[] = [];
  let links: LinkData[] = [];
  let lanes: LaneData[] = [];
  let laneTitles = [];
  let laneIndex = [];
  let facetGroups: FacetGroupData[] = [];
  let search: SearchProps;
  let nextPageUrl: string;

  feed.entries.forEach(entry => {
    if (feed instanceof AcquisitionFeed) {
      let book = entryToBook(entry, feedUrl);
      let collectionLink: OPDSCollectionLink = entry.links.find(link => link instanceof OPDSCollectionLink);
      if (collectionLink) {
        let { title, href } = collectionLink;

        if (laneIndex[title]) {
          laneIndex[title].books.push(book);
        } else {
          laneIndex[title] = { title, url: url.resolve(feedUrl, href), books: [book] };
          // use array of titles to preserve lane order
          laneTitles.push(title);
        }
      } else {
        books.push(book);
      }
    } else {
      let link = entryToLink(entry, feedUrl);
      links.push(link);
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
      return (link instanceof OPDSFacetLink);
    });

    let searchLink = feed.links.find(link => {
      return (link instanceof SearchLink);
    });
    if (searchLink) {
      search = {url: url.resolve(feedUrl, searchLink.href)};
    }

    let nextPageLink = feed.links.find(link => {
      return (link.rel === "next");
    });
    if (nextPageLink) {
      nextPageUrl = url.resolve(feedUrl, nextPageLink.href);
    }
  }

  facetGroups = facetLinks.reduce((result, link) => {
    let groupLabel = link.facetGroup;
    let label = link.title;
    let href = url.resolve(feedUrl, link.href);
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
  collection.links = links;
  collection.books = dedupeBooks(books);
  collection.facetGroups = facetGroups;
  collection.search = search;
  collection.nextPageUrl = nextPageUrl;
  Object.freeze(collection);
  return collection;
}