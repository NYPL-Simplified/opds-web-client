import DataFetcher from "./DataFetcher";
import { CollectionData, BookData, SearchData, FetchErrorData, AuthCallback, AuthCredentials, AuthProvider, AuthMethod } from "./interfaces";
export interface LoadAction<T> {
    type: string;
    data: T;
    url?: string;
}
/** Create redux actions to be dispatched by connected components, mostly
    to make requests to the server. */
export default class ActionCreator {
    private fetcher;
    static readonly REQUEST: string;
    static readonly SUCCESS: string;
    static readonly FAILURE: string;
    static readonly LOAD: string;
    static readonly CLEAR: string;
    static readonly COLLECTION: string;
    static readonly PAGE: string;
    static readonly BOOK: string;
    static readonly SEARCH_DESCRIPTION: string;
    static readonly UPDATE_BOOK: string;
    static readonly FULFILL_BOOK: string;
    static readonly LOANS: string;
    static readonly COLLECTION_REQUEST: string;
    static readonly COLLECTION_SUCCESS: string;
    static readonly COLLECTION_FAILURE: string;
    static readonly COLLECTION_LOAD: string;
    static readonly COLLECTION_CLEAR: string;
    static readonly PAGE_REQUEST: string;
    static readonly PAGE_SUCCESS: string;
    static readonly PAGE_FAILURE: string;
    static readonly PAGE_LOAD: string;
    static readonly BOOK_REQUEST: string;
    static readonly BOOK_SUCCESS: string;
    static readonly BOOK_FAILURE: string;
    static readonly BOOK_LOAD: string;
    static readonly BOOK_CLEAR: string;
    static readonly SEARCH_DESCRIPTION_LOAD: string;
    static readonly CLOSE_ERROR: string;
    static readonly UPDATE_BOOK_REQUEST: string;
    static readonly UPDATE_BOOK_SUCCESS: string;
    static readonly UPDATE_BOOK_FAILURE: string;
    static readonly UPDATE_BOOK_LOAD: string;
    static readonly FULFILL_BOOK_REQUEST: string;
    static readonly FULFILL_BOOK_SUCCESS: string;
    static readonly FULFILL_BOOK_FAILURE: string;
    static readonly LOANS_REQUEST: string;
    static readonly LOANS_SUCCESS: string;
    static readonly LOANS_FAILURE: string;
    static readonly LOANS_LOAD: string;
    static readonly SHOW_AUTH_FORM: string;
    static readonly HIDE_AUTH_FORM: string;
    static readonly SAVE_AUTH_CREDENTIALS: string;
    static readonly CLEAR_AUTH_CREDENTIALS: string;
    static readonly SET_PREFERENCE: string;
    constructor(fetcher: DataFetcher);
    fetchBlob(type: string, url?: string): (dispatch: any) => Promise<Blob>;
    fetchJSON<T>(type: string, url?: string): (dispatch: any) => Promise<T>;
    fetchOPDS<T>(type: string, url?: string): (dispatch: any) => Promise<T>;
    request(type: string, url?: string): {
        type: string;
        url: string;
    };
    success(type: string): {
        type: string;
    };
    failure(type: string, error?: FetchErrorData): {
        type: string;
        error: FetchErrorData;
    };
    load<T>(type: string, data: T, url?: string): LoadAction<T>;
    clear(type: string): {
        type: string;
    };
    fetchCollection(url: string): (dispatch: any) => Promise<CollectionData>;
    fetchPage(url: string): (dispatch: any) => Promise<CollectionData>;
    fetchBook(url: string): (dispatch: any) => Promise<BookData>;
    fetchSearchDescription(url: string): (dispatch: any) => Promise<SearchData>;
    clearCollection(): {
        type: string;
    };
    closeError(): {
        type: string;
    };
    loadBook(data: BookData, url: string): LoadAction<BookData>;
    clearBook(): {
        type: string;
    };
    updateBook(url: string): (dispatch: any) => Promise<BookData>;
    fulfillBook(url: string): (dispatch: any) => Promise<Blob>;
    indirectFulfillBook(url: string, type: string): (dispatch: any) => Promise<string>;
    fetchLoans(url: string): (dispatch: any) => Promise<CollectionData>;
    showAuthForm(callback: AuthCallback, cancel: () => void, providers: AuthProvider<AuthMethod>[], title: string, error?: string, attemptedProvider?: string): {
        type: string;
        callback: AuthCallback;
        cancel: () => void;
        providers: AuthProvider<AuthMethod>[];
        title: string;
        error: string;
        attemptedProvider: string;
    };
    closeErrorAndHideAuthForm(): (dispatch: any) => void;
    hideAuthForm(): {
        type: string;
    };
    saveAuthCredentials(credentials: AuthCredentials): {
        type: string;
        credentials: AuthCredentials;
    };
    clearAuthCredentials(): {
        type: string;
    };
    setPreference(key: string, value: string): {
        type: string;
        key: string;
        value: string;
    };
}
