import { BookData } from "../interfaces";
export interface LoansState {
    url: string | null;
    books: BookData[];
}
declare const _default: (state: LoansState | undefined, action: any) => LoansState;
export default _default;
