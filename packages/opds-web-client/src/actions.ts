import DataFetcher from "./DataFetcher";
import {
  CollectionData, BookData, SearchData, FetchErrorData,
  BasicAuthCallback, BasicAuthLabels
} from "./interfaces";

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

  BORROW_BOOK_REQUEST = "BORROW_BOOK_REQUEST";
  BORROW_BOOK_SUCCESS = "BORROW_BOOK_SUCCESS";
  BORROW_BOOK_FAILURE = "BORROW_BOOK_FAILURE";
  LOAD_BORROW_DATA = "LOAD_BORROW_DATA";

  FULFILL_BOOK_REQUEST = "FULFILL_BOOK_REQUEST";
  FULFILL_BOOK_SUCCESS = "FULFILL_BOOK_SUCCESS";
  FULFILL_BOOK_FAILURE = "FULFILL_BOOK_FAILURE";

  FETCH_LOANS_REQUEST = "FETCH_LOANS_REQUEST";
  FETCH_LOANS_SUCCESS = "FETCH_LOANS_SUCCESS";
  FETCH_LOANS_FAILURE = "FETCH_LOANS_FAILURE";
  LOAD_LOANS = "LOAD_LOANS";

  SHOW_BASIC_AUTH_FORM = "SHOW_BASIC_AUTH_FORM";
  HIDE_BASIC_AUTH_FORM = "HIDE_BASIC_AUTH_FORM";
  SAVE_BASIC_AUTH_CREDENTIALS = "SAVE_BASIC_AUTH_CREDENTIALS";
  CLEAR_BASIC_AUTH_CREDENTIALS = "CLEAR_BASIC_AUTH_CREDENTIALS";

  constructor(fetcher: DataFetcher) {
    this.fetcher = fetcher;
  }

  fetchCollection(url: string) {
    return (dispatch): Promise<CollectionData> => {
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

  borrowBook(url: string): (dispatch: any) => Promise<BookData> {
    return (dispatch) => {
      dispatch(this.borrowBookRequest());
      return new Promise((resolve, reject) => {
        this.fetcher.fetchOPDSData(url).then((data: BookData) => {
          dispatch(this.borrowBookSuccess());
          dispatch(this.loadBorrowData(data));
          resolve(data);
        }).catch((err: FetchErrorData) => {
          dispatch(this.borrowBookFailure(err));
          reject(err);
        });
      });
    };
  }

  borrowBookRequest() {
    return { type: this.BORROW_BOOK_REQUEST };
  }

  borrowBookSuccess() {
    return { type: this.BORROW_BOOK_SUCCESS };
  }

  borrowBookFailure(error) {
    return { type: this.BORROW_BOOK_FAILURE, error };
  }

  loadBorrowData(data) {
    return { type: this.LOAD_BORROW_DATA, data };
  }

  fulfillBook(url: string): (dispatch: any) => Promise<Blob> {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        dispatch(this.fulfillBookRequest());
        this.fetcher.fetch(url)
          .then(response => {
            if (response.ok) {
              return response.blob();
            } else {
              throw({
                status: response.status,
                response: "Could not fulfill book",
                url: url
              });
            }
          })
          .then(blob => {
            dispatch(this.fulfillBookSuccess());
            resolve(blob);
          })
          .catch(err => {
            dispatch(this.fulfillBookFailure(err));
            reject(err);
          });
      });
    };
  }

  indirectFulfillBook(url: string, type: string): (dispatch: any) => Promise<string> {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        dispatch(this.fulfillBookRequest());
        this.fetcher.fetchOPDSData(url).then((book: BookData) => {
          let link = book.fulfillmentLinks.find(link =>
            link.type === type
          );

          if (link) {
            dispatch(this.fulfillBookSuccess());
            resolve(link.url);
          } else {
            throw({
              status: 200,
              response: "Couldn't fulfill book",
              url: url
            });
          }
        }).catch(err => {
          dispatch(this.fulfillBookFailure(err));
          reject(err);
        });
      });
    };
  }

  fulfillBookRequest() {
    return { type: this.FULFILL_BOOK_REQUEST };
  }

  fulfillBookSuccess() {
    return { type: this.FULFILL_BOOK_SUCCESS };
  }

  fulfillBookFailure(error) {
    return { type: this.FULFILL_BOOK_FAILURE, error };
  }

  fetchLoans(url: string) {
    return (dispatch) => {
      dispatch(this.fetchLoansRequest(url));
      return new Promise((resolve, reject) => {
        this.fetcher.fetchOPDSData(url).then((data: CollectionData) => {
          dispatch(this.fetchLoansSuccess());
          dispatch(this.loadLoans(data.books));
          resolve(data);
        }).catch(err => {
          dispatch(this.fetchLoansFailure(err));
          reject(err);
        });
      });
    };
  }

  fetchLoansRequest(url: string) {
    return { type: this.FETCH_LOANS_REQUEST, url };
  }

  fetchLoansSuccess() {
    return { type: this.FETCH_LOANS_SUCCESS };
  }

  fetchLoansFailure(error?: FetchErrorData) {
    return { type: this.FETCH_LOANS_FAILURE, error };
  }

  loadLoans(books: BookData[]) {
    return { type: this.LOAD_LOANS, books };
  }

  showBasicAuthForm(
    callback: BasicAuthCallback,
    labels: BasicAuthLabels,
    title: string,
    error?: string
  ) {
    return { type: this.SHOW_BASIC_AUTH_FORM, callback, labels, title, error };
  }

  closeErrorAndHideBasicAuthForm() {
    return (dispatch) => {
      dispatch(this.closeError());
      dispatch(this.hideBasicAuthForm());
    };
  }

  hideBasicAuthForm() {
    return { type: this.HIDE_BASIC_AUTH_FORM };
  }

  saveBasicAuthCredentials(credentials: string) {
    this.fetcher.setBasicAuthCredentials(credentials);
    return { type: this.SAVE_BASIC_AUTH_CREDENTIALS, credentials };
  }

  clearBasicAuthCredentials() {
    this.fetcher.clearBasicAuthCredentials();
    return { type: this.CLEAR_BASIC_AUTH_CREDENTIALS };
  }
}