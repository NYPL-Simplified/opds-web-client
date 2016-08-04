import { BookData } from "../interfaces";

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
    case "LOAD_COLLECTION":
      let loansUrl = action.data.shelfUrl || state.url;
      let isLoans = action.url === loansUrl;

      return Object.assign({}, state, {
        url: action.data.shelfUrl || state.url,
        books: isLoans ? action.data.books : state.books
      });

    case "LOAD_LOANS":
      return Object.assign({}, state, {
        books: action.books
      });

    default:
      return state;
  }
};