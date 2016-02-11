interface FetchCollectionProps {
  fetchCollection?: (url: string, push?: boolean) => void;
  fetchPage?: (url: string) => void;
}

interface BookProps {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  imageUrl: string;
  publisher: string;
  key?: any;
}

interface LinkProps extends FetchCollectionProps {
  id: string;
  title: string;
  href: string;
  key?: string;
}

interface LaneProps extends FetchCollectionProps {
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

interface CollectionProps extends FetchCollectionProps {
  id: string;
  title: string;
  lanes: LaneProps[];
  books: BookProps[];
  links: LinkProps[];
  facetGroups?: FacetGroupProps[];
  search?: SearchProps;
  nextPageUrl?: string;
  isFetching?: boolean;
  isFetchingPage?: boolean;
  fetchSearchDescription?: (url: string) => void;
}

interface State {
  collectionData?: CollectionProps;
  collectionUrl?: string;
  isFetching?: boolean;
  error?: string;
  isFetchingPage?: boolean;
}

interface RootProps extends State, FetchCollectionProps {
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

interface CollectionLinkProps {
  text: string;
  url: string;
  className?: string;
  fetchCollection: (url: string, push?: boolean) => void;
}

interface ErrorMessageProps {
  message: string;
  closeError: () => void;
}