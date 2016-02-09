import * as React from "react";
import { connect } from "react-redux";
import {
  fetchCollection,
  clearCollection,
  fetchSearchDescription
} from "../actions";
import Collection from "./Collection";
import UrlForm from "./UrlForm";

export class Root extends React.Component<RootProps, any> {
  render() : JSX.Element {
    let loadingWidth = 200;
    let loadingStyle = {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: `${loadingWidth}px`,
      marginTop: "-10px",
      marginLeft: `-${loadingWidth/2}px`,
      padding: "30px",
      backgroundColor: "#bbb",
      textAlign: "center"
    };

    return (
      <div className="browser">
        { this.props.isFetching && <h1 className="loading" style={loadingStyle}>LOADING</h1> }

        { this.props.collectionData ?
          <Collection
            {...this.props.collectionData}
            fetchCollection={this.props.fetchCollection}
            fetchSearchDescription={this.props.fetchSearchDescription} /> :
          this.props.isFetching ? null : <UrlForm fetchCollection={this.props.fetchCollection} />
        }
      </div>
    );
  }

  componentWillMount() {
    if (this.props.startUrl) {
      this.props.fetchCollection(this.props.startUrl, false);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    collectionData: state.collection.data,
    collectionUrl: state.collection.url,
    isFetching: state.collection.isFetching
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCollection: (url: string) => {
      dispatch(fetchCollection(url));
    },
    clearCollection: () => {
      dispatch(clearCollection());
    },
    fetchSearchDescription: (url) => dispatch(fetchSearchDescription(url))
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    fetchCollection: (url: string, useHandler: boolean = true) => {
      dispatchProps.fetchCollection(url);

      if (useHandler && ownProps.onFetch) {
        ownProps.onFetch(url);
      }
    }
  });
};

let connectOptions = { withRef: true, pure: true };
const ConnectedRoot = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  connectOptions
)(Root);

export default ConnectedRoot;