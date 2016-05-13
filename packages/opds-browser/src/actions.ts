import DataFetcher from "./DataFetcher";
import { CollectionData, BookData, SearchData, FetchErrorData } from "./interfaces";

export interface LoadCollectionAction {
  type: string;
  data: CollectionData;
  url?: string;
}

export default class ActionCreator {
  private fetcher: DataFetcher;

  FETCH_COLLECTION_REQUEST = "FETCH_COLLECTION_REQUEST";
  FETCH_COLLECTION_SUCCESS = "FETCH_COLLECTION_SUCCESS";
  FETCH_COLLECTION_FAILURE = "FETCH_COLLECTION_FAILURE";
  LOAD_COLLECTION = "LOAD_COLLECTION";
  CLEAR_COLLECTION = "CLEAR_COLLECTION";

  FETCH_PAGE_REQUEST = "FETCH_PAGE_REQUEST";
  FETCH_PAGE_SUCCESS = "FETCH_PAGE_SUCCESS";
  FETCH_PAGE_FAILURE = "FETCH_PAGE_FAILURE";
  LOAD_PAGE = "LOAD_PAGE";

  FETCH_BOOK_REQUEST = "FETCH_BOOK_REQUEST";
  FETCH_BOOK_SUCCESS = "FETCH_BOOK_SUCCESS";
  FETCH_BOOK_FAILURE = "FETCH_BOOK_FAILURE";
  LOAD_BOOK = "LOAD_BOOK";
  CLEAR_BOOK = "CLEAR_BOOK";

  LOAD_SEARCH_DESCRIPTION = "LOAD_SEARCH_DESCRIPTION";
  CLOSE_ERROR = "CLOSE_ERROR";

  constructor(fetcher: DataFetcher) {
    this.fetcher = fetcher;
  }

  fetchCollection(url: string) {
    return (dispatch) => {
      dispatch(this.fetchCollectionRequest(url));
      return new Promise((resolve, reject) => {
        this.fetcher.fetchOPDSData(url).then((data: CollectionData) => {
          dispatch(this.fetchCollectionSuccess());
          dispatch(this.loadCollection(data, url));
          resolve(data);
        }).catch(err => {
          dispatch(this.fetchCollectionFailure(err));
          reject(err);
        });
      });
    };
  }

  fetchPage(url: string) {
    return (dispatch) => {
      dispatch(this.fetchPageRequest(url));
      return new Promise((resolve, reject) => {
        this.fetcher.fetchOPDSData(url).then((data: CollectionData) => {
          dispatch(this.fetchPageSuccess());
          dispatch(this.loadPage(data));
          resolve(data);
        }).catch(err => {
          dispatch(this.fetchPageFailure(err));
          reject(err);
        });
      });
    };
  }

  fetchBook(url: string) {
    return (dispatch) => {
      dispatch(this.fetchBookRequest(url));
      return new Promise((resolve, reject) => {
        this.fetcher.fetchOPDSData(url).then((data: BookData) => {
          dispatch(this.fetchBookSuccess());
          dispatch(this.loadBook(data, url));
          resolve(data);
        }).catch(err => {
          dispatch(this.fetchBookFailure(err));
          reject(err);
        });
      });
    };
  }

  fetchSearchDescription(url: string) {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        this.fetcher.fetchSearchDescriptionData(url).then((data: SearchData) => {
          dispatch(this.loadSearchDescription(data));
          resolve(data);
        }).catch(err => reject(err));
      });
    };
  }

  fetchCollectionRequest(url: string) {
    return { type: this.FETCH_COLLECTION_REQUEST, url };
  }

  fetchCollectionSuccess() {
    return { type: this.FETCH_COLLECTION_SUCCESS };
  }

  fetchCollectionFailure(error?: FetchErrorData) {
    return { type: this.FETCH_COLLECTION_FAILURE, error };
  }

  loadCollection(data: CollectionData, url?: string): LoadCollectionAction {
    return { type: this.LOAD_COLLECTION, data, url };
  }

  fetchPageRequest(url: string) {
    return { type: this.FETCH_PAGE_REQUEST, url };
  }

  fetchPageSuccess() {
    return { type: this.FETCH_PAGE_SUCCESS };
  }

  fetchPageFailure(error?: FetchErrorData) {
    return { type: this.FETCH_PAGE_FAILURE, error };
  }

  loadPage(data: CollectionData) {
    return { type: this.LOAD_PAGE, data };
  }

  clearCollection() {
    return { type: this.CLEAR_COLLECTION };
  }

  loadSearchDescription(data: SearchData) {
    return { type: this.LOAD_SEARCH_DESCRIPTION, data };
  }

  closeError() {
    return { type: this.CLOSE_ERROR };
  }

  fetchBookRequest(url: string) {
    return { type: this.FETCH_BOOK_REQUEST, url };
  }

  fetchBookSuccess() {
    return { type: this.FETCH_BOOK_SUCCESS };
  }

  fetchBookFailure(error?: FetchErrorData) {
    return { type: this.FETCH_BOOK_FAILURE, error };
  }

  loadBook(data: BookData, url: string) {
    return { type: this.LOAD_BOOK, data, url };
  }

  clearBook() {
    return { type: this.CLEAR_BOOK };
  }
}