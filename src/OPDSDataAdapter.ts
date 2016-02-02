import { OPDSArtworkLink, OPDSCatalogRootLink } from "opds-feed-parser";

function entryToBook(entry: any): Book {
  let authors = entry.authors.map((author) => {
    return author.name;
  });
  let artworkLinks = entry.links.filter((link) => {
    return (link instanceof OPDSArtworkLink);
  });
  return <Book>{
    id: entry.id,
    title: entry.title,
    authors: authors,
    summary: entry.summary,
    imageUrl: artworkLinks[0].href,
    publisher: entry.publisher     
  };
}
  
export function feedToCollection(feed: any): Collection {
  let collection = <Collection>{
    id: feed.id,
    title: feed.title
  }
  let books: Book[] = [];
  let lanes: Lane[] = [];
  let laneTitles = [];
  let laneIndex = [];
    
  feed.entries.forEach(entry => {
    let book = entryToBook(entry);
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
  });
  
  lanes = laneTitles.reduce((result, title) => {
    result.push(laneIndex[title]);
    return result;   
  }, lanes);
  
  collection.lanes = lanes;
  collection.books = books;
  
  return collection;
}