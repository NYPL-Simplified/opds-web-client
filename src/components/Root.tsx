import * as React from 'react';
import Collection from './Collection';

export default class RootComponent extends React.Component<any, any> {  
  constructor(props: any) {
    super(props);
  }

  render() : JSX.Element {    
    return (
      <div id="opdsBrowserRoot">
        <Collection {...this.props} />
      </div>
    );
  }
}