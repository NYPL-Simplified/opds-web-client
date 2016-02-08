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

interface FacetProps {
  label: string,
  href: string,
  active: boolean,
  key?: any,
  fetchUrl?: (url: string) => void
}

interface FacetGroupProps {
  label: string,
  facets: FacetProps[],
  key?: any,
  fetchUrl?: (url: string) => void
}

interface CollectionProps {
  id: string,
  title: string,
  lanes: LaneProps[],
  books: BookProps[],
  links: LinkProps[],
  facetGroups?: FacetGroupProps[];
  fetchUrl?: (url: string) => void
}

interface State {
  collectionData?: CollectionProps,
  collectionUrl?: string,
  isFetching?: boolean
}

interface RootProps extends State {
  startUrl?: string,
  dispatch?: any,
  fetchUrl?: (url: string) => void
}

interface UrlFormProps {
  fetchUrl?: (url: string) => void
}