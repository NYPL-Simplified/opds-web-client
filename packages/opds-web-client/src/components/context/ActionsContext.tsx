import * as React from "react";
import useThunkDispatch from "../../hooks/useThunkDispatch";
import DataFetcher from "../../DataFetcher";
import ActionsCreator from "../../actions";

// The main context for this app's Actions.
type ActionsContextType =
  | { fetcher: DataFetcher; actions: ActionsCreator }
  | undefined;
export const ActionsContext = React.createContext<ActionsContextType>(
  undefined
);

export function ActionsProvider({
  children,
  actions,
  fetcher
}: {
  children: React.ReactNode;
  actions: ActionsCreator;
  fetcher: DataFetcher;
}) {
  return (
    <ActionsContext.Provider value={{ actions, fetcher }}>
      {children}
    </ActionsContext.Provider>
  );
}

/**
 * Custom hook used for getting access to the available Actions.
 */
export function useActions() {
  const context = React.useContext(ActionsContext);
  const dispatch = useThunkDispatch();
  if (typeof context === "undefined") {
    throw new Error("useActions must be used within a ActionsProvider");
  }
  const { actions, fetcher } = context;
  return { actions, fetcher, dispatch };
}

export default ActionsContext;
