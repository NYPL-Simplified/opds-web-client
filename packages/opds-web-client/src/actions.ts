import DataFetcher from "./DataFetcher";
import { RequestError } from "./DataFetcher";
import {
  CollectionData,
  BookData,
  SearchData,
  FetchErrorData,
  AuthCallback,
  AuthCredentials,
  AuthProvider,
  AuthMethod
} from "./interfaces";
import { flattenSamlProviders } from "./utils/auth";

export interface LoadAction<T> {
  type: string;
  data: T;
  url?: string;
}

/** Create redux actions to be dispatched by connected components, mostly
    to make requests to the server. */
export default class ActionCreator {
  private fetcher: DataFetcher;

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

  constructor(fetcher: DataFetcher) {
    this.fetcher = fetcher;
  }

  fetchBlob(type: string, url: string) {
    return async (dispatch): Promise<Blob> => {
      dispatch(this.request(type, url));
      try {
        const response = await this.fetcher.fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          dispatch(this.success(type));
          return blob;
        }
        /**
         * If this the response errored after a redirect, try again
         * without the Authorization header, as it causes errors when
         * redirected to Amazon S3
         */
        if (response.redirected) {
          const newResp = await this.fetcher.fetch(response.url, {
            headers: { Authorization: "" }
          });
          const blob = await newResp.blob();
          if (newResp.ok) {
            dispatch(this.success(type));
            return blob;
          }
          console.error("Original Response ", response);
          console.error("New Response ", newResp);
          throw {
            status: 500,
            response: `Retried fetch after redirect. The retry did not succeed.`,
            url
          };
        }
        console.error("Response: ", response);
        throw {
          status: 500,
          url,
          response: `Response was not okay and was not retried (wasn't the result of a redirect).`
        };
      } catch (e) {
        dispatch(this.failure(type, e));
        throw e;
      }
    };
  }

  fetchJSON<T>(type: string, url: string) {
    let err: RequestError;
    return (dispatch): Promise<T> => {
      return new Promise<T>((resolve, reject) => {
        dispatch(this.request(type, url));
        this.fetcher
          .fetch(url)
          .then(response => {
            if (response.ok) {
              response
                .json()
                .then((data: T) => {
                  dispatch(this.success(type));
                  dispatch(this.load<T>(type, data));
                  resolve(data);
                })
                .catch(parseError => {
                  err = {
                    status: response.status,
                    response: "Non-json response",
                    url: url
                  };
                  dispatch(this.failure(type, err));
                  reject(err);
                });
            } else {
              response
                .json()
                .then(data => {
                  err = {
                    status: response.status,
                    response: data.detail,
                    url: url
                  };
                  dispatch(this.failure(type, err));
                  reject(err);
                })
                .catch(parseError => {
                  err = {
                    status: response.status,
                    response: "Request failed",
                    url: url
                  };
                  dispatch(this.failure(type, err));
                  reject(err);
                });
            }
          })
          .catch(err => {
            err = {
              status: null,
              response: err.message,
              url: url
            };
            dispatch(this.failure(type, err));
            reject(err);
          });
      });
    };
  }

  fetchOPDS<T>(type: string, url: string) {
    return (dispatch): Promise<T> => {
      dispatch(this.request(type, url));
      return new Promise<T>((resolve, reject) => {
        this.fetcher
          .fetchOPDSData(url)
          .then((data: T) => {
            dispatch(this.success(type));
            dispatch(this.load<T>(type, data, url));
            resolve(data);
          })
          .catch(err => {
            dispatch(this.failure(type, err));
            reject(err);
          });
      });
    };
  }

  request(type: string, url?: string) {
    return { type: `${type}_${ActionCreator.REQUEST}`, url: url };
  }

  success(type: string) {
    return { type: `${type}_${ActionCreator.SUCCESS}` };
  }

  failure(type: string, error?: FetchErrorData) {
    return { type: `${type}_${ActionCreator.FAILURE}`, error };
  }

  load<T>(type: string, data: T, url?: string): LoadAction<T> {
    return { type: `${type}_${ActionCreator.LOAD}`, data, url };
  }

  clear(type: string) {
    return { type: `${type}_${ActionCreator.CLEAR}` };
  }

  fetchCollection(url: string) {
    return this.fetchOPDS<CollectionData>(ActionCreator.COLLECTION, url);
  }

  fetchPage(url: string) {
    return this.fetchOPDS<CollectionData>(ActionCreator.PAGE, url);
  }

  fetchBook(url: string) {
    return this.fetchOPDS<BookData>(ActionCreator.BOOK, url);
  }

  fetchSearchDescription(url: string) {
    return dispatch => {
      return new Promise<SearchData>((resolve, reject) => {
        this.fetcher
          .fetchSearchDescriptionData(url)
          .then((data: SearchData) => {
            dispatch(
              this.load<SearchData>(ActionCreator.SEARCH_DESCRIPTION, data, url)
            );
            resolve(data);
          })
          .catch(err => reject(err));
      });
    };
  }

  clearCollection() {
    return this.clear(ActionCreator.COLLECTION);
  }

  closeError() {
    return { type: ActionCreator.CLOSE_ERROR };
  }

  loadBook(data: BookData, url: string) {
    return this.load<BookData>(ActionCreator.BOOK, data, url);
  }

  clearBook() {
    return this.clear(ActionCreator.BOOK);
  }

  updateBook(url: string): (dispatch: any) => Promise<BookData> {
    return this.fetchOPDS<BookData>(ActionCreator.UPDATE_BOOK, url);
  }

  fulfillBook(url: string): (dispatch: any) => Promise<Blob> {
    return this.fetchBlob(ActionCreator.FULFILL_BOOK, url);
  }

  indirectFulfillBook(
    url: string,
    type: string
  ): (dispatch: any) => Promise<string> {
    return dispatch => {
      return new Promise<string>((resolve, reject) => {
        dispatch(this.request(ActionCreator.FULFILL_BOOK, url));
        this.fetcher
          .fetchOPDSData(url)
          .then((book: BookData) => {
            let link = book.fulfillmentLinks?.find(link => link.type === type);

            if (link) {
              dispatch(this.success(ActionCreator.FULFILL_BOOK));
              resolve(link.url);
            } else {
              throw {
                status: 200,
                response: "Couldn't fulfill book",
                url: url
              };
            }
          })
          .catch(err => {
            dispatch(this.failure(ActionCreator.FULFILL_BOOK, err));
            reject(err);
          });
      });
    };
  }

  fetchLoans(url: string) {
    return this.fetchOPDS<CollectionData>(ActionCreator.LOANS, url);
  }

  showAuthForm(
    callback: AuthCallback,
    cancel: () => void,
    providers: AuthProvider<AuthMethod>[],
    title: string,
    error?: string,
    attemptedProvider?: string | null
  ) {
    const flattenedProviders = flattenSamlProviders(providers);
    return {
      type: ActionCreator.SHOW_AUTH_FORM,
      callback,
      cancel,
      providers: flattenedProviders,
      title,
      error,
      attemptedProvider
    };
  }

  closeErrorAndHideAuthForm() {
    return dispatch => {
      dispatch(this.closeError());
      dispatch(this.hideAuthForm());
    };
  }

  hideAuthForm() {
    return { type: ActionCreator.HIDE_AUTH_FORM };
  }

  saveAuthCredentials(credentials: AuthCredentials) {
    this.fetcher.setAuthCredentials(credentials);
    return { type: ActionCreator.SAVE_AUTH_CREDENTIALS, credentials };
  }

  clearAuthCredentials() {
    this.fetcher.clearAuthCredentials();
    return { type: ActionCreator.CLEAR_AUTH_CREDENTIALS };
  }

  setPreference(key: string, value: string) {
    return { type: ActionCreator.SET_PREFERENCE, key: key, value: value };
  }
}
