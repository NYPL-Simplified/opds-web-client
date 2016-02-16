interface BaseProps extends __React.HTMLProps<any> {
}

interface FetchCollectionProps {
  fetchCollection?: (url: string, push?: boolean) => void;
  fetchPage?: (url: string) => void;
}

interface BookActionProps {
  showBookDetails?: (book: BookProps) => void;
  hideBookDetails?: () => void;
  collectionUrl?: string;
}

interface BookProps extends BookActionProps {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  imageUrl: string;
  publisher: string;
  published?: string;
  key?: any;
  url?: string;
}

interface LaneProps extends FetchCollectionProps, BookActionProps {
  title: string;
  url: string;
  books: BookProps[];
  key?: any;
}

interface FacetProps extends FetchCollectionProps {
  label: string;
  href: string;
  active: boolean;
  key?: any;
}

interface FacetGroupProps extends FetchCollectionProps {
  label: string;
  facets: FacetProps[];
  key?: any;
}

interface SearchProps extends FetchCollectionProps {
  url?: string;
  data?: {
    description: string;
    shortName: string;
    template: (searchTerms: string) => string;
  };
  fetchSearchDescription?: (url: string) => void;
}

interface CollectionProps extends FetchCollectionProps, BookActionProps {
  id: string;
  url: string;
  title: string;
  lanes: LaneProps[];
  books: BookProps[];
  links: LinkProps[];
  facetGroups?: FacetGroupProps[];
  search?: SearchProps;
  nextPageUrl?: string;
  isFetching?: boolean;
  isFetchingPage?: boolean;
  error?: string;
  fetchSearchDescription?: (url: string) => void;
}

interface State {
  collectionData?: CollectionProps;
  collectionUrl?: string;
  isFetching?: boolean;
  error?: string;
  book?: BookProps;
  isFetchingPage?: boolean;
}

interface RootProps extends State, FetchCollectionProps, BookActionProps {
  startUrl?: string;
  onFetch?: (url: string) => any;
  dispatch?: any;
  clearCollection?: () => void;
  ref?: any;
  fetchSearchDescription?: (url: string) => void;
  closeError?: () => void;
}

interface UrlFormProps extends FetchCollectionProps {
  url?: string;
}

interface Link {
  id: string;
  title: string;
  href: string;
  key?: string;
}

interface LinkProps extends BaseProps {
  text?: string; // optional because link can have child elements instead of text
  url: string;
}

interface CollectionLinkProps extends LinkProps, FetchCollectionProps {
  id?: string;
}

interface BookPreviewLinkProps extends LinkProps, BookActionProps {
  book?: BookProps;
  collectionUrl: string;
}

interface ErrorMessageProps {
  message: string;
  closeError: () => void;
  retry?: () => void;
}