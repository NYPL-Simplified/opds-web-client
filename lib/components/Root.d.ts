import * as React from "react";
import { Store } from "redux";
import { State } from "../state";
import { ComputeBreadcrumbs } from "./Breadcrumbs";
import { CollectionData, BookData, StateProps, NavigateContext, AuthCallback, AuthProvider, AuthMethod, AuthCredentials, FacetGroupData } from "../interfaces";
import AuthPlugin from "../AuthPlugin";
export interface HeaderProps extends React.Props<{}> {
    collectionTitle: string | null;
    bookTitle: string | null;
    loansUrl?: string;
    isSignedIn?: boolean;
    fetchLoans?: (url: string) => Promise<CollectionData>;
    clearAuthCredentials?: () => void;
}
export interface FooterProps extends React.Props<{}> {
    collection: CollectionData;
}
export interface CollectionContainerProps extends React.Props<{}> {
    facetGroups?: FacetGroupData[];
}
export interface BookDetailsContainerProps extends React.Props<{}> {
    bookUrl?: string;
    collectionUrl?: string;
    refreshCatalog?: () => Promise<any>;
    book?: BookData | null;
}
export interface RootProps extends StateProps {
    store?: Store<State>;
    authPlugins?: AuthPlugin[];
    collectionUrl?: string;
    bookUrl?: string;
    proxyUrl?: string;
    dispatch?: any;
    setCollectionAndBook?: (collectionUrl?: string, bookUrl?: string) => Promise<any>;
    clearCollection?: () => void;
    clearBook?: () => void;
    fetchSearchDescription?: (url: string) => void;
    closeError?: () => void;
    fetchBook?: (bookUrl: string) => Promise<BookData>;
    refreshCollectionAndBook?: () => Promise<any>;
    retryCollectionAndBook?: () => Promise<any>;
    pageTitleTemplate?: (collectionTitle: string, bookTitle: string) => string;
    epubReaderUrlTemplate?: (epubUrl: string) => string;
    fetchPage?: (url: string) => Promise<CollectionData>;
    Header?: React.ComponentClass<HeaderProps, {}>;
    Footer?: React.ComponentClass<FooterProps, {}>;
    CollectionContainer?: React.ComponentClass<CollectionContainerProps, {}>;
    BookDetailsContainer?: React.ComponentClass<BookDetailsContainerProps, {}>;
    computeBreadcrumbs?: ComputeBreadcrumbs;
    updateBook: (url: string) => Promise<BookData>;
    fulfillBook: (url: string) => Promise<Blob>;
    indirectFulfillBook: (url: string, type: string) => Promise<string>;
    fetchLoans?: (url: string) => Promise<CollectionData>;
    saveAuthCredentials?: (credentials: AuthCredentials) => void;
    clearAuthCredentials?: () => void;
    showAuthForm?: (callback: AuthCallback, providers: AuthProvider<AuthMethod>[], title: string) => void;
    closeErrorAndHideAuthForm?: () => void;
    setPreference: (key: string, value: string) => void;
    allLanguageSearch?: boolean;
}
export interface RootState {
    authError?: string | null;
}
/** The root component of the application that connects to the Redux store and
    passes props to other components. */
export declare class Root extends React.Component<RootProps, RootState> {
    context: NavigateContext;
    static contextTypes: React.ValidationMap<NavigateContext>;
    constructor(props: any);
    render(): JSX.Element;
    componentWillMount(): Promise<void> | undefined;
    componentWillReceiveProps(nextProps: RootProps): void;
    updatePageTitle(props: any): void;
    showPrevBook(): void;
    showNextBook(): void;
    showRelativeBook(relativeIndex: number): void;
}
declare const ConnectedRoot: any;
export default ConnectedRoot;
