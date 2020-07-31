import { CollectionData, BookData, AuthCallback, AuthCredentials } from "../interfaces";
export declare function findBookInCollection(collection: CollectionData | null, book: string): BookData | null | undefined;
export declare function mapStateToProps(state: any, ownProps: any): {
    collectionData: any;
    isFetchingCollection: any;
    isFetchingPage: any;
    isFetchingBook: any;
    error: any;
    bookData: any;
    history: any;
    loadedCollectionUrl: any;
    loadedBookUrl: any;
    collectionUrl: any;
    bookUrl: any;
    loansUrl: any;
    loans: any;
    auth: any;
    isSignedIn: boolean;
    preferences: any;
};
export declare function mapDispatchToProps(dispatch: any): {
    createDispatchProps: (fetcher: any) => {
        fetchCollection: (url: string) => any;
        fetchPage: (url: string) => any;
        fetchBook: (url: string) => any;
        loadBook: (book: BookData, url: string) => any;
        clearCollection: () => any;
        clearBook: () => any;
        fetchSearchDescription: (url: string) => any;
        closeError: () => any;
        updateBook: (url: string) => any;
        fulfillBook: (url: string) => any;
        indirectFulfillBook: (url: string, type: string) => any;
        fetchLoans: (url: string) => any;
        saveAuthCredentials: (credentials: AuthCredentials) => any;
        clearAuthCredentials: () => any;
        showAuthForm: (callback: AuthCallback, cancel: () => void, providers: any, title: string) => any;
        closeErrorAndHideAuthForm: () => any;
        setPreference: (key: string, value: string) => any;
    };
};
export declare function createFetchCollectionAndBook(dispatch: any): (collectionUrl: string | null | undefined, bookUrl?: string | null | undefined) => Promise<{
    collectionData: CollectionData | null;
    bookData: BookData | null;
}>;
export declare function fetchCollectionAndBook({ fetchCollection, fetchBook, collectionUrl, bookUrl }: {
    fetchCollection: any;
    fetchBook: any;
    collectionUrl: any;
    bookUrl: any;
}): Promise<{
    collectionData: CollectionData | null;
    bookData: BookData | null;
}>;
export declare function mergeRootProps(stateProps: any, createDispatchProps: any, componentProps: any): any;
