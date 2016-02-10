import { fetchOPDSData, fetchSearchDescriptionData } from "./fetchData";

export const FETCH_COLLECTION_REQUEST = "FETCH_COLLECTION_REQUEST";
export const FETCH_COLLECTION_SUCCESS = "FETCH_COLLECTION_SUCCESS";
export const FETCH_COLLECTION_FAILURE = "FETCH_COLLECTION_FAILURE";
export const LOAD_COLLECTION = "LOAD_COLLECTION";
export const CLEAR_COLLECTION = "CLEAR_COLLECTION";
export const LOAD_SEARCH_DESCRIPTION = "LOAD_SEARCH_DESCRIPTION";

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

export function clearCollection() {
  return { type: CLEAR_COLLECTION };
}

export function loadSearchDescription(data: SearchProps) {
  return { type: LOAD_SEARCH_DESCRIPTION, data };
}