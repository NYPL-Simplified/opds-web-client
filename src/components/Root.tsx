import * as React from 'react';
import { connect } from 'react-redux'
import { fetchCollection } from '../actions';
import Collection from './Collection';
import UrlForm from './UrlForm';

export class Root extends React.Component<RootProps, any> {
  render() : JSX.Element {
    return (
      <div className="browser">
        { this.props.collectionData ?
          <Collection {...this.props.collectionData} fetchUrl={this.props.fetchUrl} /> :
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
    collectionUrl: state.collection.url
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUrl: (url) => dispatch(fetchCollection(url))
  }
}

const ConnectedRoot = connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);

export default ConnectedRoot;