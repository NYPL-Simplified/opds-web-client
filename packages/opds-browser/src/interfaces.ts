export interface BookData {
  id: string;
  title: string;
  authors?: string[];
  contributors?: string[];
  summary?: string;
  imageUrl?: string;
  url?: string;
  publisher?: string;
  published?: string;
  categories?: string[];
}

export interface LaneData {
  title: string;
  url: string;
  books: BookData[];
}

export interface FacetData {
  label: string;
  href: string;
  active: boolean;
}

export interface FacetGroupData {
  label: string;
  facets: FacetData[];
}

export interface CollectionData {
  id: string;
  url: string;
  title: string;
  lanes: LaneData[];
  books: BookData[];
  links: LinkData[];
  facetGroups?: FacetGroupData[];
  search?: SearchData;
  nextPageUrl?: string;
  catalogRootUrl?: string;
}

export interface SearchData {
  url?: string;
  searchData?: {
    description: string;
    shortName: string;
    template: (searchTerms: string) => string;
  };
}

export interface LinkData {
  id: string;
  text: string;
  url: string;
}

// these properties need to be optional because they're used by RootProps,
// which doesn't implement them until Root is connected to the state by redux;
// initially, Root isn't provided most of these props
export interface State {
  collectionData?: CollectionData;
  collectionUrl?: string;
  isFetching?: boolean;
  error?: FetchErrorData;
  bookData?: BookData;
  bookUrl?: string;
  isFetchingPage?: boolean;
  history?: LinkData[];
}

export interface Navigate {
  (collectionUrl: string, book: BookData|string, isTopLevel?: boolean): void;
}

export interface PathFor {
  (collectionUrl: string, bookUrl: string): string;
}

export interface FetchErrorData {
  status: number;
  response: string;
  url: string;
}

export interface NavigateContext {
  router?: {
    push: (location: string|{
      pathname: string,
      state?: any
    })=> any;
  };
  pathFor: (collectionUrl: string, bookUrl: string) => string;
}