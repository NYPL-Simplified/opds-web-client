interface BaseProps extends __React.HTMLProps<any> {
  pathFor?: (collectionUrl: string, bookUrl: string) => string;
}

interface CollectionActionProps {
  navigate?: (collectionUrl: string, book: BookData|string, isTopLevel?: boolean) => Promise<any>;
  fetchPage?: (url: string) => void;
  isTopLevel?: boolean;
}

interface BookActionProps {
  navigate?: (collectionUrl: string, book: BookData|string, isTopLevel?: boolean) => Promise<any>;
  clearBook?: () => void;
  book?: BookData;
  collectionUrl?: string;
}

interface BookData {
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

interface LaneData {
  title: string;
  url: string;
  books: BookData[];
}

interface FacetData {
  label: string;
  href: string;
  active: boolean;
}

interface FacetGroupData {
  label: string;
  facets: FacetData[];
}

interface CollectionData {
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

interface SearchData extends CollectionActionProps, BaseProps {
  url?: string;
  searchData?: {
    description: string;
    shortName: string;
    template: (searchTerms: string) => string;
  };
}

// these properties need to be optional because they're used by RootProps,
// which doesn't implement them until Root is connected to the state by redux;
// initially, Root isn't provided most of these props
interface State {
  collectionData?: CollectionData;
  collectionUrl?: string;
  isFetching?: boolean;
  error?: FetchError;
  bookData?: BookData;
  bookUrl?: string;
  isFetchingPage?: boolean;
  history?: LinkData[];
}

interface UrlFormProps extends CollectionActionProps, BaseProps {
  url?: string;
}

interface LinkData {
  id: string;
  text: string;
  url: string;
}

interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

interface FetchError {
  status: number;
  response: string;
  url: string;
}

interface BreadcrumbsProps extends BaseProps, CollectionActionProps {
  history: LinkData[];
  collection: CollectionData;
  showCurrentLink?: Boolean;
}