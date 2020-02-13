import * as React from "react";
import { PathFor } from "../../interfaces";
import * as PropTypes from "prop-types";

/**
 * This is a component that will pass the pathFor prop down the tree
 * via both old and new context apis.
 */

export const PathForContext = React.createContext<PathFor | undefined>(
  undefined
);

type PathForProps = {
  pathFor: PathFor;
  children: React.ReactChild;
};

export default class PathForProvider extends React.Component<PathForProps> {
  static childContextTypes: React.ValidationMap<{}> = {
    pathFor: PropTypes.func.isRequired
  };

  getChildContext() {
    return {
      pathFor: this.props.pathFor
    };
  }

  render() {
    return (
      <PathForContext.Provider value={this.props.pathFor}>
        {this.props.children}
      </PathForContext.Provider>
    );
  }
}

export function usePathFor() {
  const context = React.useContext(PathForContext);
  if (typeof context === "undefined") {
    throw new Error("usePathFor must be used within a PathForProvider");
  }
  return context;
}
