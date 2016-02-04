import * as React from 'react';
import Collection from './Collection';

export default class RootComponent extends React.Component<CollectionProps, any> {
  render() : JSX.Element {    
    return (
      <div id="opdsBrowserRoot">
        <Collection {...this.props} />
      </div>
    );
  }
}