import * as React from 'react';
import { connect } from 'react-redux'
import { fetchCollection } from '../actions';
import Collection from './Collection';
import UrlForm from './UrlForm';

class Root extends React.Component<RootProps, any> {
  render() : JSX.Element {    
    let fetchUrl = (url) => this.props.dispatch(fetchCollection(url));

    return (
      <div id="browser">
        { this.props.collectionData && <Collection {...this.props.collectionData} fetchUrl={fetchUrl} /> }
        { !this.props.collectionData && <UrlForm fetchUrl={fetchUrl} /> }
      </div>
    );
  }
  
  componentDidMount() {
    if (this.props.startUrl) {
      this.props.dispatch(fetchCollection(this.props.startUrl));
    }
  }
}

const mapStateToProps = (state) => {
  return {
    collectionData: state.collection.data,
    collectionUrl: state.collection.url
  }
};

const ConnectedRoot = connect(mapStateToProps)(Root);

export default ConnectedRoot;