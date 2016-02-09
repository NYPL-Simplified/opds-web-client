import * as React from "react";
import { connect } from "react-redux";
import { fetchCollection, clearCollection } from "../actions";
import Collection from "./Collection";
import UrlForm from "./UrlForm";
import * as queryString from "query-string";

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
        { this.props.isFetching && <h1 className="loading" style={loadingStyle}>LOADING</h1>
        }

        { this.props.collectionData ?
          <Collection {...this.props.collectionData} fetchCollection={this.props.fetchCollection} /> :
          this.props.isFetching ? null : <UrlForm fetchCollection={this.props.fetchCollection} />
        }
      </div>
    );
  }

  componentWillMount() {
    if (this.props.startUrl) {
      this.props.fetchCollection(this.props.startUrl);
    }

    window.onpopstate = event => {
      if (event.state && event.state.collectionUrl) {
        this.props.fetchCollection(event.state.collectionUrl, false);
      } else {
        this.props.clearCollection();
      }
    };

    this.parseQueryString();
  }

  parseQueryString() {
    let params = queryString.parse(window.location.search);

    if (params.url) {
      this.props.fetchCollection(params.url);
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
    fetchCollection: (url, push: boolean = true) => {
      dispatch(fetchCollection(url));

      if (push) {
        window.history.pushState({ collectionUrl: url }, url, "?url=" + url);
      }
    },
    clearCollection: () => {
      dispatch(clearCollection());
    }
  }
}

const ConnectedRoot = connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);

export default ConnectedRoot;