import * as React from "react";
import * as PropTypes from "prop-types";
import * as Redux from "redux";
import { ReactReduxContext } from "react-redux";
import Root from "./Root";
import { State } from "../state";
import AuthPlugin from "../AuthPlugin";
import OPDSStore from "./context/StoreContext";

export interface OPDSCatalogProps {
  collectionUrl?: string;
  bookUrl?: string;
  authPlugins?: AuthPlugin[];
  pageTitleTemplate?: (collectionTitle: string, bookTitle: string) => string;
  proxyUrl?: string;
  initialState?: State;
  epubReaderUrlTemplate?: (epubUrl: string) => string;
}

/**
 * The main application component.
 *  - Renders root and passes props along with store to root
 *  - Creates the redux store using OPDSStore
 *  - Consumes and passes it down
 *  - Passes the redux store down the tree in context
 */
const OPDSCatalog: React.FunctionComponent<OPDSCatalogProps> = props => {
  return (
    <OPDSStore
      initialState={props.initialState}
      authPlugins={props.authPlugins}
    >
      <ReactReduxContext.Consumer>
        {({ store }: { store: Redux.Store<State> }) => {
          return <Root store={store} {...props} />;
        }}
      </ReactReduxContext.Consumer>
    </OPDSStore>
  );
};

export default OPDSCatalog;
