import { CollectionData, LinkData, FetchErrorData } from "../interfaces";
export interface CollectionState {
    url: string;
    data: CollectionData;
    isFetching: boolean;
    isFetchingPage: boolean;
    error: FetchErrorData;
    history: LinkData[];
}
declare const collection: (state: CollectionState, action: any) => CollectionState;
export default collection;
