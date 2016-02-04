import { OPDSArtworkLink, AcquisitionFeed } from "opds-feed-parser";
import * as url from 'url';

function entryToBook(entry: any, feedUrl: string): Book {
  let authors = entry.authors.map((author) => {
    return author.name;
  });
  let artworkLinks = entry.links.filter((link) => {
    return (link instanceof OPDSArtworkLink);
  });

  let imageUrl;
  if (artworkLinks.length > 0) {
    imageUrl = url.resolve(feedUrl, artworkLinks[0].href);
  }
  return <Book>{
    id: entry.id,
    title: entry.title,
    authors: authors,
    summary: entry.summary,
    imageUrl: imageUrl,
    publisher: entry.publisher     
  };
}

function entryToLink(entry: any, feedUrl: string): Link {
  let href: string;
  let links = entry.links;
  if (links.length > 0) {
     href = url.resolve(feedUrl, links[0].href);
  }
  return <Link>{
    id: entry.id,
    title: entry.title,
    href: href
  };
}

export function feedToCollection(feed: any, feedUrl: string): Collection {
  let collection = <Collection>{
    id: feed.id,
    title: feed.title
  }
  let books: Book[] = [];
  let links: Link[] = [];
  let lanes: Lane[] = [];
  let laneTitles = [];
  let laneIndex = [];
    
  feed.entries.forEach(entry => {
    if (feed instanceof AcquisitionFeed) {
      let book = entryToBook(entry, feedUrl);
      if (entry.collection) {
        let { title, url } = entry.collection;

        if (laneIndex[title]) {
          laneIndex[title].books.push(book);
        } else {
          laneIndex[title] = { title, url, books: [book] };
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
  
  collection.lanes = lanes;
  collection.links = links;
  collection.books = books;
  
  return collection;
}