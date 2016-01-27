import * as React from 'react';
import FeedComponent from './Feed';

export default class RootComponent extends React.Component<any, any> {  
  constructor(props: RootProps) {
    super(props);
  }

  render() : JSX.Element {    
    return (
      <div id="opdsBrowserRoot">
        <FeedComponent {...this.props.feed} />
      </div>
    );
  }
}