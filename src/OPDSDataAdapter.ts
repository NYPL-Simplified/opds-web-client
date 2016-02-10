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
  return <BookProps>{
    id: entry.id,
    title: entry.title,
    authors: authors,
    summary: entry.summary,
    imageUrl: imageUrl,
    publisher: entry.publisher
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
    result.push(laneIndex[title]);
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
  collection.books = books;
  collection.facetGroups = facetGroups;
  collection.search = search;
  Object.freeze(collection);
  return collection;
}