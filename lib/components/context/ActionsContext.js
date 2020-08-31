"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var useThunkDispatch_1 = require("../../hooks/useThunkDispatch");
exports.ActionsContext = React.createContext(undefined);
function ActionsProvider(_a) {
    var children = _a.children, actions = _a.actions, fetcher = _a.fetcher;
    return (React.createElement(exports.ActionsContext.Provider, { value: { actions: actions, fetcher: fetcher } }, children));
}
exports.ActionsProvider = ActionsProvider;
/**
 * Custom hook used for getting access to the available Actions.
 */
function useActions() {
    var context = React.useContext(exports.ActionsContext);
    var dispatch = useThunkDispatch_1.default();
    if (typeof context === "undefined") {
        throw new Error("useActions must be used within a ActionsProvider");
    }
    var actions = context.actions, fetcher = context.fetcher;
    return { actions: actions, fetcher: fetcher, dispatch: dispatch };
}
exports.useActions = useActions;
exports.default = exports.ActionsContext;
