import buildStore from "./store";
import { createFetchCollectionAndBook } from "./components/mergeRootProps";
import { CollectionState } from "./reducers/collection";
import { BookState } from "./reducers/book";
import { LoansState } from "./reducers/loans";
import { AuthState } from "./reducers/auth";
import { PreferencesState } from "./reducers/preferences";

export interface State {
  collection: CollectionState;
  book: BookState;
  loans: LoansState;
  auth: AuthState;
  preferences: PreferencesState;
}

/** Builds initial redux state for a collection and book. This isn't used in this
    package, but it's available for other apps if they need to build the state
    for server-side rendering. */
export default function buildInitialState(
  collectionUrl?: string,
  bookUrl?: string
): Promise<State> {
  const store = buildStore(undefined, []);
  const fetchCollectionAndBook = createFetchCollectionAndBook(store.dispatch);
  return new Promise((resolve, reject) => {
    fetchCollectionAndBook(collectionUrl, bookUrl)
      .then(({ collectionData, bookData }) => {
        resolve(store.getState());
      })
      .catch(err => reject(err));
  });
}
