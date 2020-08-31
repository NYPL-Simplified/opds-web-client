import * as React from "react";
import DataFetcher from "../../DataFetcher";
import ActionsCreator from "../../actions";
declare type ActionsContextType = {
    fetcher: DataFetcher;
    actions: ActionsCreator;
} | undefined;
export declare const ActionsContext: React.Context<ActionsContextType>;
export declare function ActionsProvider({ children, actions, fetcher }: {
    children: React.ReactNode;
    actions: ActionsCreator;
    fetcher: DataFetcher;
}): JSX.Element;
/**
 * Custom hook used for getting access to the available Actions.
 */
export declare function useActions(): {
    actions: ActionsCreator;
    fetcher: DataFetcher;
    dispatch: import("../../hooks/useThunkDispatch").ReduxDispatch;
};
export default ActionsContext;
