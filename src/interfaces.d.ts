interface EntryModel {
  id: string,
  title: string;
  // type: string;
  // author: string;
  // summary?: string;
  // updated: string;
  // imageUrl: string;
  // infoUrl: string;
  // status: string;
  // copiesAvailable: number;
  // copiesTotal: number;
  // collection: string;
}

interface FeedModel {
  id: string;
  title: string;
  updated: string;
  link: string;
  entries: Array<EntryModel>;
}

interface FeedProps extends FeedModel {
}

interface RootProps {
  feed: FeedProps;
}