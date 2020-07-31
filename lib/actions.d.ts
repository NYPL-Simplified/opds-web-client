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
    static readonly REQUEST = "REQUEST";
    static readonly SUCCESS = "SUCCESS";
    static readonly FAILURE = "FAILURE";
    static readonly LOAD = "LOAD";
    static readonly CLEAR = "CLEAR";
    static readonly COLLECTION = "COLLECTION";
    static readonly PAGE = "PAGE";
    static readonly BOOK = "BOOK";
    static readonly SEARCH_DESCRIPTION = "SEARCH_DESCRIPTION";
    static readonly UPDATE_BOOK = "UPDATE_BOOK";
    static readonly FULFILL_BOOK = "FULFILL_BOOK";
    static readonly LOANS = "LOANS";
    static readonly COLLECTION_REQUEST = "COLLECTION_REQUEST";
    static readonly COLLECTION_SUCCESS = "COLLECTION_SUCCESS";
    static readonly COLLECTION_FAILURE = "COLLECTION_FAILURE";
    static readonly COLLECTION_LOAD = "COLLECTION_LOAD";
    static readonly COLLECTION_CLEAR = "COLLECTION_CLEAR";
    static readonly PAGE_REQUEST = "PAGE_REQUEST";
    static readonly PAGE_SUCCESS = "PAGE_SUCCESS";
    static readonly PAGE_FAILURE = "PAGE_FAILURE";
    static readonly PAGE_LOAD = "PAGE_LOAD";
    static readonly BOOK_REQUEST = "BOOK_REQUEST";
    static readonly BOOK_SUCCESS = "BOOK_SUCCESS";
    static readonly BOOK_FAILURE = "BOOK_FAILURE";
    static readonly BOOK_LOAD = "BOOK_LOAD";
    static readonly BOOK_CLEAR = "BOOK_CLEAR";
    static readonly SEARCH_DESCRIPTION_LOAD = "SEARCH_DESCRIPTION_LOAD";
    static readonly CLOSE_ERROR = "CLOSE_ERROR";
    static readonly UPDATE_BOOK_REQUEST = "UPDATE_BOOK_REQUEST";
    static readonly UPDATE_BOOK_SUCCESS = "UPDATE_BOOK_SUCCESS";
    static readonly UPDATE_BOOK_FAILURE = "UPDATE_BOOK_FAILURE";
    static readonly UPDATE_BOOK_LOAD = "UPDATE_BOOK_LOAD";
    static readonly FULFILL_BOOK_REQUEST = "FULFILL_BOOK_REQUEST";
    static readonly FULFILL_BOOK_SUCCESS = "FULFILL_BOOK_SUCCESS";
    static readonly FULFILL_BOOK_FAILURE = "FULFILL_BOOK_FAILURE";
    static readonly LOANS_REQUEST = "LOANS_REQUEST";
    static readonly LOANS_SUCCESS = "LOANS_SUCCESS";
    static readonly LOANS_FAILURE = "LOANS_FAILURE";
    static readonly LOANS_LOAD = "LOANS_LOAD";
    static readonly SHOW_AUTH_FORM = "SHOW_AUTH_FORM";
    static readonly HIDE_AUTH_FORM = "HIDE_AUTH_FORM";
    static readonly SAVE_AUTH_CREDENTIALS = "SAVE_AUTH_CREDENTIALS";
    static readonly CLEAR_AUTH_CREDENTIALS = "CLEAR_AUTH_CREDENTIALS";
    static readonly SET_PREFERENCE = "SET_PREFERENCE";
    constructor(fetcher: DataFetcher);
    fetchBlob(type: string, url: string): (dispatch: any) => Promise<Blob>;
    fetchJSON<T>(type: string, url: string): (dispatch: any) => Promise<T>;
    fetchOPDS<T>(type: string, url: string): (dispatch: any) => Promise<T>;
    request(type: string, url?: string): {
        type: string;
        url: string | undefined;
    };
    success(type: string): {
        type: string;
    };
    failure(type: string, error?: FetchErrorData): {
        type: string;
        error: FetchErrorData | undefined;
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
    showAuthForm(callback: AuthCallback, cancel: () => void, providers: AuthProvider<AuthMethod>[], title: string, error?: string, attemptedProvider?: string | null): {
        type: string;
        callback: AuthCallback;
        cancel: () => void;
        providers: AuthProvider<AuthMethod>[];
        title: string;
        error: string | undefined;
        attemptedProvider: string | null | undefined;
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
