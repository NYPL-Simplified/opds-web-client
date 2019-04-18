import { BookData, FetchErrorData } from "../interfaces";
export interface BookState {
    url: string;
    data: BookData;
    isFetching: boolean;
    error: FetchErrorData;
}
declare const book: (state: BookState, action: any) => BookState;
export default book;
