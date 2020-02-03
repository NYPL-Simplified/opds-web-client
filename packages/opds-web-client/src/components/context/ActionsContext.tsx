import * as React from "react";
import ActionsCreator from "../../actions";
import useThunkDispatch from "../../hooks/useThunkDispatch";
import DataFetcher from "../../DataFetcher";
import { adapter } from "../../OPDSDataAdapter";

// The main context for this app's Actions.
export const ActionsContext = React.createContext<ActionsCreator | undefined>(
  undefined
);

export function ActionsProvider({ children }) {
  const fetcher = new DataFetcher({ adapter });
  const actions = new ActionsCreator(fetcher);

  return (
    <ActionsContext.Provider value={actions}>
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
  return { actions: context, dispatch };
}

export default ActionsContext;
