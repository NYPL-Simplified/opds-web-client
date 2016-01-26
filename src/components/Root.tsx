import * as React from 'react';
import Feed from './Feed';

export default class Root extends React.Component<any, any> {  
  constructor(props: RootProps) {
    super(props);
  }

  render() : JSX.Element {    
    return (
      <div id="opdsBrowserRoot">
        <Feed {...this.props.feed} />
      </div>
    );
  }
}