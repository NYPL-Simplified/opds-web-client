interface CollectionModel {
  title: string,
  url: string,
}

interface CollectionProps extends CollectionModel {  
  key: string,
  entries: EntryModel[],
}

interface EntryModel {
  id: string,
  title: string,
  type: string,
  author: string,
  summary?: string,
  updated: string,
  imageUrl: string,
  infoUrl?: string,
  language: string,
  publisher: string,
  collection?: CollectionModel,
  // status: string,
  // copiesAvailable: number,
  // copiesTotal: number,
}

interface EntryProps extends EntryModel {  
  key: string,
}

declare type EntryCollections = { [index: string]: { url: string, entries: EntryModel[] } };

interface FeedModel {
  id: string,
  title: string,
  updated: string,
  link: string,
  entries: Array<EntryModel>,
}

interface FeedProps extends FeedModel {
}

interface RootProps {
  feed: FeedProps,
}