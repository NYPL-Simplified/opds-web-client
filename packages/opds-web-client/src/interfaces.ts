export interface BookData {
  id: string;
  title: string;
  authors?: string[];
  contributors?: string[];
  summary?: string;
  imageUrl?: string;
  openAccessLinks?: {
    url: string;
    type: string;
  }[];
  borrowUrl?: string;
  fulfillmentLinks?: {
    url: string;
    type: string;
    indirectType: string;
  }[];
  availability?: {
    status: string;
    since?: string;
    until?: string;
  };
  holds?: {
    total: number;
    position?: number;
  };
  copies?: {
    total: number;
    available: number;
  };
  url?: string;
  publisher?: string;
  published?: string;
  categories?: string[];
  raw?: any;
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
  navigationLinks: LinkData[];
  facetGroups?: FacetGroupData[];
  search?: SearchData;
  nextPageUrl?: string;
  catalogRootLink?: LinkData;
  parentLink?: LinkData;
  shelfUrl?: string;
  links?: LinkData[];
  raw?: any;
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
  text: string;
  url: string;
  id?: string;
  type?: string;
}

// these properties need to be optional because they're used by RootProps,
// which doesn't implement them until Root is connected to the state by redux;
// initially, Root isn't provided most of these props
export interface StateProps {
  collectionData?: CollectionData;
  collectionUrl?: string;
  isFetching?: boolean;
  error?: FetchErrorData;
  bookData?: BookData;
  bookUrl?: string;
  isFetchingPage?: boolean;
  history?: LinkData[];
  basicAuth?: BasicAuthData;
  basicAuthCredentials?: string;
  isSignedIn?: boolean;
  loansUrl?: string;
  loans?: BookData[];
}

export interface PathFor {
  (collectionUrl: string, bookUrl: string): string;
}

export interface FetchErrorData {
  status: number;
  response: string;
  url: string;
}

export interface Location {
  pathname: string;
  state?: any;
}

export interface Router {
  push: (location: string|Location) => any;
  createHref: (location: string|Location) => string;
  isActive: (location: string|Location, onlyActiveOnIndex?: boolean) => boolean;
}

export interface NavigateContext {
  router?: Router;
  pathFor: PathFor;
}

export interface BasicAuthCallback {
  (credentials: string): any;
}

export interface BasicAuthData {
  showForm: boolean;
  callback: BasicAuthCallback;
  credentials: string;
  title: string;
  loginLabel: string;
  passwordLabel: string;
  error: string;
}

export interface BasicAuthLabels {
  login: string;
  password: string;
}