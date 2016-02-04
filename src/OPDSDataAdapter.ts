import { OPDSArtworkLink, OPDSCollectionLink } from "opds-feed-parser";
import * as url from 'url';

function entryToBook(entry: any, feedUrl: string): BookProps {
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
  return <BookProps>{
    id: entry.id,
    title: entry.title,
    authors: authors,
    summary: entry.summary,
    imageUrl: imageUrl,
    publisher: entry.publisher     
  };
}
  
export function feedToCollection(feed: any, feedUrl: string): CollectionProps {
  let collection = <CollectionProps>{
    id: feed.id,
    title: feed.title
  }
  let books: BookProps[] = [];
  let lanes: LaneProps[] = [];
  let laneTitles = [];
  let laneIndex = [];
    
  feed.entries.forEach(entry => {
    let book = entryToBook(entry, feedUrl);
    let collection: OPDSCollectionLink = entry.links.find(link => link instanceof OPDSCollectionLink); 
    if (collection) {
      let { title, href } = collection;
      
      if (laneIndex[title]) {
        laneIndex[title].books.push(book);
      } else {
        laneIndex[title] = { title, url, books: [book] };
        laneTitles.push(title);
      }
    } else {
      books.push(book);
    }      
  });
  
  lanes = laneTitles.reduce((result, title) => {
    result.push(laneIndex[title]);
    return result;   
  }, lanes);
  
  collection.lanes = lanes;
  collection.books = books;
  
  return collection;
}