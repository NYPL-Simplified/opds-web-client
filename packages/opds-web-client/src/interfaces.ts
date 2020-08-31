import AuthPlugin from "./AuthPlugin";

export const ATOM_MEDIA_TYPE =
  'text/html;profile="http://librarysimplified.org/terms/profiles/streaming-media"';

export const AXIS_NOW_WEBPUB_MEDIA_TYPE =
  "application/vnd.librarysimplified.axisnow+json";

export type ReadOnlineMediaType =
  | typeof ATOM_MEDIA_TYPE
  | typeof AXIS_NOW_WEBPUB_MEDIA_TYPE;

// the source of truth for media types is located at:
// https://github.com/NYPL-Simplified/server_core/blob/master/model/constants.py
export type MediaType =
  | "application/epub+zip"
  | "application/kepub+zip"
  | "application/pdf"
  | "application/vnd.adobe.adept+xml"
  | "vnd.adobe/adept+xml"
  | "application/x-mobipocket-ebook"
  | "application/x-mobi8-ebook"
  | "application/atom+xml;type=entry;profile=opds-catalog"
  | "application/audiobook+json"
  | "application/vnd.overdrive.circulation.api+json;profile=audiobook"
  | "application/vnd.overdrive.circulation.api+json;profile=ebook"
  | ReadOnlineMediaType;

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

export type BookAvailability =
  | "available"
  | "unavailable"
  | "reserved"
  | "ready";
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
  allBorrowLinks?: FulfillmentLink[];
  availability?: {
    status: BookAvailability;
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

/**
 * The provider has a method T, and the plugin might have a different
 * method, as is the case with SAML Auth where the plugin takes
 * a ClientSamlMethod but the original provider takes a ServerSamlMethod
 */
export interface AuthProvider<T extends AuthMethod, P extends AuthMethod = T> {
  id: string;
  plugin: AuthPlugin<P>;
  method: T;
}

export interface AuthLink {
  rel: string;
  href: string;
}
export interface AuthMethod {
  type: string;
  description?: string;
  links?: AuthLink[];
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

export type SamlIdp = {
  privacy_statement_urls: [];
  logo_urls: [];
  display_names: [
    {
      language: string;
      value: string;
    }
  ];
  href: string;
  descriptions: [
    {
      language: string;
      value: string;
    }
  ];
  rel: "authenticate";
  information_urls: [];
};
/**
 * The server representation has multiple IDPs nested into the one.
 * We will flatten that out before placing into redux state.
 */
export interface ServerSamlMethod extends AuthMethod {
  links: SamlIdp[];
}
export interface ClientSamlMethod extends AuthMethod {
  href: string;
}
