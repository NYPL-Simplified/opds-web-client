function entryToBook(entry: any): Book {
  return <Book>{
    id: entry.id,
    title: entry.title,
    author: entry.author,
    summary: entry.summary,
    imageUrl: entry.imageUrl,
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
      books.push(entry);
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