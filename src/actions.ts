import { fetchOPDSData } from "./fetchData";

export const FETCH_COLLECTION_REQUEST = "FETCH_COLLECTION_REQUEST";
export const FETCH_COLLECTION_SUCCESS = "FETCH_COLLECTION_SUCCESS";
export const LOAD_COLLECTION = "LOAD_COLLECTION";

export function fetchCollection(url: string) {
  return function(dispatch) {
    dispatch(fetchCollectionRequest(url));
    console.log("fetching url: ", url)

    return fetchOPDSData(url, (data) => {
      dispatch(fetchCollectionSuccess());
      dispatch(loadCollection(data, url));
    });
  }
}

export function fetchCollectionRequest(url: string) {
  return { type: FETCH_COLLECTION_REQUEST, url };
}

export function fetchCollectionSuccess() {
  return { type: FETCH_COLLECTION_SUCCESS };
}

export function loadCollection(data: CollectionProps, url?: string) {
  return { type: LOAD_COLLECTION, data, url };
}