import * as React from "react";
import { Store } from "redux";
import { connect } from "react-redux";
import { adapter } from "../OPDSDataAdapter";
import DataFetcher from "../DataFetcher";
import ActionsCreator from "../actions";
import Lane from "./Lane";
import { CollectionData, LaneData, FetchErrorData } from "../interfaces";
import spinner from "../images/spinner";

export interface LanesProps {
  url: string;
  lanes?: LaneData[];
  fetchCollection?: (url: string) => Promise<CollectionData>;
  clearCollection?: () => void;
  store?: Store<{ collection: CollectionData; }>;
  namespace?: string;
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
          <div className="spinner">
            <img
              src={spinner}
              />
          </div>
        }

        { this.props.lanes && this.props.lanes.length > 0 ?
          <ul aria-label="groups of books" className="subtle-list">
          { this.props.lanes && this.props.lanes.map(lane =>
            <li key={lane.url}>
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

  componentWillReceiveProps(newProps) {
    if (newProps.url !== this.props.url) {
      if (this.props.clearCollection) {
        this.props.clearCollection();
      }
      if (this.props.fetchCollection) {
        this.props.fetchCollection(newProps.url);
      }
    }
  }

  componentWillUnmount() {
    if (this.props.clearCollection) {
      this.props.clearCollection();
    }
  }
}

function mapStateToProps(state, ownProps) {
  let key = ownProps.namespace || "collection";
  return {
    lanes: state[key].data ? state[key].data.lanes : [],
    isFetching: state[key].isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createDispatchProps: function(fetcher) {
      let actions = new ActionsCreator(fetcher);

      return {
        fetchCollection: (url: string) => dispatch(actions.fetchCollection(url)),
        clearCollection: () => dispatch(actions.clearCollection())
      };
    }
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