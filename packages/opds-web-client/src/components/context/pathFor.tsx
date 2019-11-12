import * as React from 'react';
import { PathFor } from '../../interfaces';
import * as PropTypes from 'prop-types';

/**
 * This is a component that will pass the pathFor prop down the tree
 * via both old and new context apis. This will allow circulation-patron-web
 * to make it available without resorting to the old api
 */

export const PathForContext = React.createContext(null);

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
      pathFor: this.props.pathFor,
    };
  }

  render() {
    return (
      <PathForContext.Provider value={this.props.pathFor}>
        {this.props.children}
      </PathForContext.Provider>
    )
  }
}