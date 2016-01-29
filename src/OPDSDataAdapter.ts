import { pick, assign } from 'lodash';

export function entryToBook(entry: any): Book {
  return <Book>pick(entry, ['id', 'title', 'author', 'summary', 'imageUrl', 'publisher']);
}
  
export function feedToCollection(feed: any): Collection {
  let collection = pick(feed, ['id', 'title']);
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
        laneIndex[title] = { url, books: [book] };
        laneTitles.push(title);
      }
    } else {
      books.push(entry);
    }      
  });
  
  lanes = laneTitles.reduce((result, title) => {
    result.push(assign({}, laneIndex[title], { title }));
    return result;   
  }, lanes);
  
  return <Collection>assign(collection, { lanes, books });
}