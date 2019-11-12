import * as React from 'react'
import {Provider} from 'react-redux'
import * as Redux from 'redux'
import { State } from "../../state";
import AuthPlugin from "../../AuthPlugin";
import buildStore from "../../store";
import {PathForContext} from './pathFor';
import BasicAuthPlugin from "../../BasicAuthPlugin";


// type FunctionChild = (store: Redux.Store<State>) => React.ReactNode;
type OPDSStoreProps = {
  children: React.ReactElement;
  initialState?: State;
  authPlugins?: AuthPlugin[];
}
/**
 * Builds the redux store and makes it available in context.
 * takes in the pathFor context
 */
export default class OPDSStore extends React.Component<OPDSStoreProps>{
  static contextType = PathForContext;
  context: React.ContextType<typeof PathForContext>;

  store: Redux.Store<State>;

  constructor(props, context) {
    super(props);
    this.store = buildStore(this.props.initialState || undefined, this.props.authPlugins || [BasicAuthPlugin], context.pathFor);
  }

  render() {
    return (
      <Provider store={this.store}>
        {this.props.children}
      </Provider>
    )
  }
}