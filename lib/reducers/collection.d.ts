import { CollectionData, LinkData, FetchErrorData } from "../interfaces";
export interface CollectionState {
    url: string | null;
    data?: CollectionData | null;
    isFetching?: boolean;
    isFetchingPage: boolean;
    error?: FetchErrorData | null;
    history: LinkData[];
    pageUrl?: string;
}
export declare const initialState: CollectionState;
declare const collection: (state: CollectionState | undefined, action: any) => CollectionState;
export default collection;
