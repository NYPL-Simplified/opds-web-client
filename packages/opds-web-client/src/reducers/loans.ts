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
      return Object.assign({}, state, {
        url: action.data.shelfUrl || state.url
      });

    case "LOAD_LOANS":
      return Object.assign({}, state, {
        books: action.books
      });

    default:
      return state;
  }
};