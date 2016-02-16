import { fetchOPDSData, fetchSearchDescriptionData } from "./fetchData";

export const FETCH_COLLECTION_REQUEST = "FETCH_COLLECTION_REQUEST";
export const FETCH_COLLECTION_SUCCESS = "FETCH_COLLECTION_SUCCESS";
export const FETCH_COLLECTION_FAILURE = "FETCH_COLLECTION_FAILURE";
export const LOAD_COLLECTION = "LOAD_COLLECTION";
export const CLEAR_COLLECTION = "CLEAR_COLLECTION";

export const FETCH_PAGE_REQUEST = "FETCH_PAGE_REQUEST";
export const FETCH_PAGE_SUCCESS = "FETCH_PAGE_SUCCESS";
export const FETCH_PAGE_FAILURE = "FETCH_PAGE_FAILURE";
export const LOAD_PAGE = "LOAD_PAGE";

export const FETCH_BOOK_REQUEST = "FETCH_BOOK_REQUEST";
export const FETCH_BOOK_SUCCESS = "FETCH_BOOK_SUCCESS";
export const FETCH_BOOK_FAILURE = "FETCH_BOOK_FAILURE";
export const LOAD_BOOK = "LOAD_BOOK";
export const CLEAR_BOOK = "CLEAR_BOOK";

export const LOAD_SEARCH_DESCRIPTION = "LOAD_SEARCH_DESCRIPTION";
export const CLOSE_ERROR = "CLOSE_ERROR";

export function fetchCollection(url: string) {
  return function(dispatch) {
    dispatch(fetchCollectionRequest(url));
    return new Promise((resolve, reject) => {
      fetchOPDSData(url).then((data: CollectionData) => {
        dispatch(fetchCollectionSuccess());
        dispatch(loadCollection(data, url));
        resolve(data);
      }).catch(err => {
        dispatch(fetchCollectionFailure(err));
        reject(err);
      });
    });
  };
}

export function fetchPage(url: string) {
  return function(dispatch) {
    dispatch(fetchPageRequest(url));
    return new Promise((resolve, reject) => {
      fetchOPDSData(url).then((data: CollectionData) => {
        dispatch(loadPage(data));
        dispatch(fetchPageSuccess());
        resolve(data);
      }).catch(err => {
        dispatch(fetchPageFailure(err));
        reject(err);
      });
    });
  };
}

export function fetchBook(url: string) {
  return function(dispatch) {
    dispatch(fetchBookRequest(url));
    return new Promise((resolve, reject) => {
      fetchOPDSData(url).then((data: BookData) => {
        dispatch(fetchBookSuccess());
        dispatch(loadBook(data, url));
        resolve(data);
      }).catch(err => {
        dispatch(fetchBookFailure(err));
        reject(err);
      });
    });
  };
}

export function fetchSearchDescription(url: string) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      fetchSearchDescriptionData(url).then((data: SearchProps) => {
        dispatch(loadSearchDescription(data));
        resolve(data);
      }).catch(err => reject(err));
    });
  };
}

export function fetchCollectionRequest(url: string) {
  return { type: FETCH_COLLECTION_REQUEST, url };
}

export function fetchCollectionSuccess() {
  return { type: FETCH_COLLECTION_SUCCESS };
}

export function fetchCollectionFailure(message?: string) {
  return { type: FETCH_COLLECTION_FAILURE, message };
}

export function loadCollection(data: CollectionData, url?: string) {
  return { type: LOAD_COLLECTION, data, url };
}

export function fetchPageRequest(url: string) {
  return { type: FETCH_PAGE_REQUEST, url };
}

export function fetchPageSuccess() {
  return { type: FETCH_PAGE_SUCCESS };
}

export function fetchPageFailure(message?: string) {
  return { type: FETCH_PAGE_FAILURE, message };
}

export function loadPage(data: CollectionData) {
  return { type: LOAD_PAGE, data };
}

export function clearCollection() {
  return { type: CLEAR_COLLECTION };
}

export function loadSearchDescription(data: SearchProps) {
  return { type: LOAD_SEARCH_DESCRIPTION, data };
}

export function closeError() {
  return { type: CLOSE_ERROR };
}

export function fetchBookRequest(url: string) {
  return { type: FETCH_BOOK_REQUEST, url };
}

export function fetchBookSuccess() {
  return { type: FETCH_BOOK_SUCCESS };
}

export function fetchBookFailure(message?: string) {
  return { type: FETCH_BOOK_FAILURE, message };
}

export function loadBook(data: BookData, url: string) {
  return { type: LOAD_BOOK, data, url };
}

export function clearBook() {
  return { type: CLEAR_BOOK };
}