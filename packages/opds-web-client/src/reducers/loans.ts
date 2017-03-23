import { BookData } from "../interfaces";
import ActionCreator from "../actions";

export interface LoansState {
  url: string;
  books: BookData[];
}

const initialState: LoansState = {
  url: null,
  books: []
};

export default (state: LoansState = initialState, action): LoansState => {
  switch (action.type) {
    case ActionCreator.LOAD_COLLECTION:
      let loansUrl = action.data.shelfUrl || state.url;
      let isLoans = action.url === loansUrl;

      return Object.assign({}, state, {
        url: action.data.shelfUrl || state.url,
        books: isLoans ? action.data.books : state.books
      });

    case ActionCreator.LOAD_LOANS:
      return Object.assign({}, state, {
        books: action.books
      });

    case ActionCreator.CLEAR_AUTH_CREDENTIALS:
      // Clear auth credentials should remove the authenticated
      // user's loans as well.
      return Object.assign({}, state, {
        books: []
      });

    case ActionCreator.LOAD_UPDATE_BOOK_DATA:
      // A book has been updated, so the loans feed is now outdated.
      // If we remove the loans, the components showing the book that
      // was updated can use the data from the book update request 
      // until the next LOAD_LOANS action.

      return Object.assign({}, state, {
        books: []
      });

    default:
      return state;
  }
};