import AuthPlugin from "./AuthPlugin";

export interface BookData {
  id: string;
  title: string;
  series?: {
    name: string;
    position?: number;
  };
  authors?: string[];
  contributors?: string[];
  subtitle?: string;
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
  language?: string;
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
  isFetchingCollection?: boolean;
  isFetchingBook?: boolean;
  error?: FetchErrorData;
  bookData?: BookData;
  bookUrl?: string;
  isFetchingPage?: boolean;
  history?: LinkData[];
  auth?: AuthData;
  authCredentials?: AuthCredentials;
  isSignedIn?: boolean;
  loansUrl?: string;
  loans?: BookData[];
  preferences?: {
    [key: string]: string;
  };
}

export interface PathFor {
  (collectionUrl?: string, bookUrl?: string): string;
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
  push: (location: string | Location) => any;
  createHref: (location: string | Location) => string;
  isActive: (
    location: string | Location,
    onlyActiveOnIndex?: boolean
  ) => boolean;
}

export interface NavigateContext {
  router?: Router;
  pathFor: PathFor;
}

export interface AuthCredentials {
  provider: string;
  credentials: string;
}

export interface AuthCallback {
  (): any;
}

export interface AuthProvider<T extends AuthMethod> {
  id: string;
  plugin: AuthPlugin;
  method: T;
}

export interface AuthMethod {
  type: string;
  description?: string;
}

export interface AuthData {
  showForm: boolean;
  callback: AuthCallback;
  cancel: () => void;
  credentials: AuthCredentials;
  title: string;
  error: string | null;
  attemptedProvider: string | null;
  providers: AuthProvider<AuthMethod>[];
}

export interface BasicAuthMethod extends AuthMethod {
  labels: {
    login: string;
    password: string;
  };
}
