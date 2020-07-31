import { BookData, FetchErrorData } from "../interfaces";
export interface BookState {
    url: string | null;
    data: BookData | null;
    isFetching: boolean;
    error: FetchErrorData | null;
}
declare const book: (state: BookState | undefined, action: any) => BookState;
export default book;
