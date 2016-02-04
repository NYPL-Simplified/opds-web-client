interface BookProps {
  id: string,
  title: string,
  authors: string[],
  summary: string,
  imageUrl: string,
  publisher: string,
  key?: any
}

interface LaneProps {
  title: string,
  url: string,
  books: BookProps[],
  key?: any
}

interface CollectionProps {
  id: string,
  title: string,
  lanes: LaneProps[],
  books: BookProps[],
}