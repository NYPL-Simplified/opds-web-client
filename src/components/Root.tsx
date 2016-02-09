import * as React from 'react';
import { connect } from 'react-redux'
import { fetchCollection, fetchSearchDescription } from '../actions';
import Collection from './Collection';
import UrlForm from './UrlForm';

export class Root extends React.Component<RootProps, any> {
  render() : JSX.Element {
    let loadingStyle = {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: "-10px",
      marginLeft: "-10px",
      padding: "30px",
      backgroundColor: "#bbb"
    };

    return (
      <div className="browser">
        { this.props.isFetching && <h1 className="loading" style={loadingStyle}>LOADING</h1> }

        { this.props.collectionData ?
          <Collection {...this.props.collectionData} fetchUrl={this.props.fetchUrl} fetchSearchDescription={this.props.fetchSearchDescription} /> :
          <UrlForm fetchUrl={this.props.fetchUrl} />
        }
      </div>
    );
  }

  componentWillMount() {
    if (this.props.startUrl) {
      this.props.fetchUrl(this.props.startUrl);
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
    fetchUrl: (url) => dispatch(fetchCollection(url)),
    fetchSearchDescription: (url) => dispatch(fetchSearchDescription(url))
  }
}

const ConnectedRoot = connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);

export default ConnectedRoot;