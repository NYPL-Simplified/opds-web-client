import {
  OPDSArtworkLink,
  AcquisitionFeed,
  OPDSCollectionLink,
  OPDSFacetLink,
  SearchLink
} from "opds-feed-parser";
import * as url from "url";

function entryToBook(entry: any, feedUrl: string): BookProps {
  let authors = entry.authors.map((author) => {
    return author.name;
  });
  let artworkLinks = entry.links.filter((link) => {
    return (link instanceof OPDSArtworkLink);
  });

  let imageUrl, imageThumbLink;
  if (artworkLinks.length > 0) {
    imageThumbLink = artworkLinks.find(link => link.rel === "http://opds-spec.org/image/thumbnail");
    if (imageThumbLink) {
      imageUrl = url.resolve(feedUrl, imageThumbLink.href);
    } else {
      console.log("WARNING: using possibly large image for " + entry.title);
      imageUrl = url.resolve(feedUrl, artworkLinks[0].href);
    }
  }

  // until OPDSParser parses dcterms:publisher...
  let publisher = entry.unparsed && entry.unparsed["dcterms:publisher"] ? entry.unparsed["dcterms:publisher"][0]["_"] : null;
  let published = formatDate(entry.published);

  return <BookProps>{
    id: entry.id,
    title: entry.title,
    authors: authors,
    summary: entry.summary.content,
    imageUrl: imageUrl,
    publisher: publisher,
    published: published
  };
}

function entryToLink(entry: any, feedUrl: string): LinkProps {
  let href: string;
  let links = entry.links;
  if (links.length > 0) {
     href = url.resolve(feedUrl, links[0].href);
  }
  return <LinkProps>{
    id: entry.id,
    title: entry.title,
    href: href
  };
}

function dedupeBooks(books: BookProps[]): BookProps[] {
  // using Map because it preserves key order
  let bookIndex = books.reduce((index, book) => {
    index.set(book.id, book);
    return index;
  }, new Map<any, BookProps>());

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

export function feedToCollection(feed: any, feedUrl: string): CollectionProps {
  let collection = <CollectionProps>{
    id: feed.id,
    title: feed.title
  };
  let books: BookProps[] = [];
  let links: LinkProps[] = [];
  let lanes: LaneProps[] = [];
  let laneTitles = [];
  let laneIndex = [];
  let facetGroups: FacetGroupProps[] = [];
  let search: SearchProps;

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
  Object.freeze(collection);
  return collection;
}