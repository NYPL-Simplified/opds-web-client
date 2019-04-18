import { BookData } from "../interfaces";
export interface LoansState {
    url: string;
    books: BookData[];
}
declare const _default: (state: LoansState, action: any) => LoansState;
export default _default;
