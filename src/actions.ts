import { fetchOPDSData, fetchSearchDescriptionData } from "./fetchData";

export const FETCH_COLLECTION_REQUEST = "FETCH_COLLECTION_REQUEST";
export const FETCH_COLLECTION_SUCCESS = "FETCH_COLLECTION_SUCCESS";
export const FETCH_COLLECTION_FAILURE = "FETCH_COLLECTION_FAILURE";
export const LOAD_COLLECTION = "LOAD_COLLECTION";

export const FETCH_PAGE_REQUEST = "FETCH_PAGE_REQUEST";
export const FETCH_PAGE_SUCCESS = "FETCH_PAGE_SUCCESS";
export const FETCH_PAGE_FAILURE = "FETCH_PAGE_FAILURE";
export const LOAD_PAGE = "LOAD_PAGE";

export const CLEAR_COLLECTION = "CLEAR_COLLECTION";

export const LOAD_SEARCH_DESCRIPTION = "LOAD_SEARCH_DESCRIPTION";
export const CLOSE_ERROR = "CLOSE_ERROR";
export const SHOW_BOOK_DETAILS = "SHOW_BOOK_DETAILS";
export const HIDE_BOOK_DETAILS = "HIDE_BOOK_DETAILS";

export function fetchCollection(url: string) {
  return function(dispatch) {
    dispatch(fetchCollectionRequest(url));
    return new Promise((resolve, reject) => {
      fetchOPDSData(url).then((data: CollectionProps) => {
        dispatch(loadCollection(data, url));
        dispatch(fetchCollectionSuccess());
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
      fetchOPDSData(url).then((data: CollectionProps) => {
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

export function loadCollection(data: CollectionProps, url?: string) {
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

export function loadPage(data: CollectionProps) {
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

export function showBookDetails(book: BookProps) {
  return { type: SHOW_BOOK_DETAILS, book };
}

export function hideBookDetails() {
  return { type: HIDE_BOOK_DETAILS };
}