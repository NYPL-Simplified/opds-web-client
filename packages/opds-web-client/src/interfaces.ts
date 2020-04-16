import AuthPlugin from "./AuthPlugin";

export type MediaType =
  | "application/epub+zip"
  | "application/kepub+zip"
  | "application/pdf"
  | "application/vnd.adobe.adept+xml"
  | "vnd.adobe/adept+xml"
  | "application/x-mobipocket-ebook"
  | "application/x-mobi8-ebook"
  | "application/atom+xml;type=entry;profile=opds-catalog"
  | "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";

export interface MediaLink {
  url: string;
  type: MediaType;
}

export interface FulfillmentLink extends MediaLink {
  indirectType: string;
}

export type BookMedium =
  | "http://bib.schema.org/Audiobook"
  | "http://schema.org/EBook"
  | "http://schema.org/Book";
export interface BookData {
  id: string;
  title: string;
  series?: {
    name: string;
    position?: number;
  } | null;
  authors?: string[];
  contributors?: string[];
  subtitle?: string;
  summary?: string;
  imageUrl?: string;
  openAccessLinks?: MediaLink[];
  borrowUrl?: string;
  fulfillmentLinks?: FulfillmentLink[];
  availability?: {
    status: string;
    since?: string;
    until?: string;
  };
  holds?: {
    total: number;
    position?: number;
  } | null;
  copies?: {
    total: number;
    available: number;
  } | null;
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
  catalogRootLink?: LinkData | null;
  parentLink?: LinkData | null;
  shelfUrl?: string;
  links?: LinkData[] | null;
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
  text?: string;
  url: string;
  id?: string | null;
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
  (collectionUrl?: string | null, bookUrl?: string | null): string;
}

export interface FetchErrorData {
  status: number | null;
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
  callback: AuthCallback | null;
  cancel: (() => void) | null;
  credentials: AuthCredentials | null;
  title: string | null;
  error: string | null;
  attemptedProvider: string | null;
  providers: AuthProvider<AuthMethod>[] | null;
}

export interface BasicAuthMethod extends AuthMethod {
  labels: {
    login: string;
    password: string;
  };
}

/** Utility to make keys K of type T both required (defined) and not null */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  { [P in K]-?: NonNullable<T[P]> };
