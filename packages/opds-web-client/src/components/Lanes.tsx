import * as React from "react";
import { Store } from "redux";
import { connect } from "react-redux";
import { adapter } from "../OPDSDataAdapter";
import DataFetcher from "../DataFetcher";
import ActionsCreator from "../actions";
import Lane from "./Lane";
import { CollectionData, LaneData, FetchErrorData } from "../interfaces";
import { subtleListStyle } from "./styles";
import spinner from "../images/spinner";

export interface LanesProps {
  url: string;
  lanes?: LaneData[];
  fetchCollection?: (url: string) => Promise<CollectionData>;
  clearCollection?: () => void;
  store?: Store<{ collection: CollectionData; }>;
  proxyUrl?: string;
  hiddenBookIds?: string[];
  hideMoreLinks?: boolean;
  isFetching?: boolean;
}

export class Lanes extends React.Component<any, any> {
  render() {
    return (
      <div className="lanes">
        { this.props.isFetching &&
          <div style={{ textAlign: "center" }}>
            <img
              className="lanesSpinner"
              src={spinner}
              style={{ width: "30px", height: "30px" }}
              />
          </div>
        }

        { this.props.lanes && this.props.lanes.length > 0 ?
          <ul aria-label="groups of books" style={subtleListStyle}>
          { this.props.lanes && this.props.lanes.map(lane =>
            <li key={lane.title}>
              <Lane
                lane={lane}
                collectionUrl={this.props.url}
                hideMoreLink={this.props.hideMoreLinks}
                hiddenBookIds={this.props.hiddenBookIds}
                />
            </li>
          ) }
          </ul> : null
        }
      </div>
    );
  }

  componentWillMount() {
    if (this.props.fetchCollection && (!this.props.lanes || !this.props.lanes.length)) {
      this.props.fetchCollection(this.props.url);
    }
  }

  componentWillUnmount() {
    if (this.props.clearCollection) {
      this.props.clearCollection();
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    lanes: state.collection.data ? state.collection.data.lanes : [],
    isFetching: state.collection.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return (fetcher) => {
    let actions = new ActionsCreator(fetcher);

    return {
      fetchCollection: (url: string) => dispatch(actions.fetchCollection(url)),
      clearCollection: () => dispatch(actions.clearCollection())
    };
  };
}

function mergeLanesProps(stateProps, createDispatchProps, componentProps) {
  let fetcher = new DataFetcher({
    proxyUrl: componentProps.proxyUrl,
    adapter: adapter
  });
  let dispatchProps = createDispatchProps.createDispatchProps(fetcher);

  return Object.assign({}, componentProps, stateProps, dispatchProps);
}

const ConnectedLanes = connect<any, any, any>(
  mapStateToProps,
  mapDispatchToProps,
  mergeLanesProps
)(Lanes);

export default ConnectedLanes;