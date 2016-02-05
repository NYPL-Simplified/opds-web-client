interface BookProps {
  id: string,
  title: string,
  authors: string[],
  summary: string,
  imageUrl: string,
  publisher: string,
  key?: any
}

interface LinkProps {
  id: string,
  title: string,
  href: string,
  key?: string,
  fetchUrl?: (url: string) => void
}

interface LaneProps {
  title: string,
  url: string,
  books: BookProps[],
  key?: any,
  fetchUrl?: (url: string) => void
}

interface CollectionProps {
  id: string,
  title: string,
  lanes: LaneProps[],
  books: BookProps[],
  links: LinkProps[],
  fetchUrl?: (url: string) => void
}

interface State {
  collectionData?: CollectionProps,
  collectionUrl?: string
}

interface RootProps extends State {
  startUrl?: string,
  dispatch?: any,
  fetchUrl?: (url: string) => void
}