import { fetchOPDSData } from './fetchData';

export const REQUEST_COLLECTION = 'REQUEST_COLLECTION';
export const LOAD_COLLECTION = 'LOAD_COLLECTION';

export function fetchCollection(url: string) {
  return function(dispatch) {
    dispatch(requestCollection(url));
    console.log("fetching url: ", url)

    return fetchOPDSData(url, (data) => {
      dispatch(loadCollection(data, url));
    });
  }
}

export function requestCollection(url: string) {
  return { type: REQUEST_COLLECTION, url };
}

export function loadCollection(data: CollectionProps, url?: string) {
  return { type: LOAD_COLLECTION, data, url };
}