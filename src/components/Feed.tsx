import * as React from 'react';

export default class Feed extends React.Component<FeedProps, any> {  
  constructor(props: FeedProps) {
    super(props);
  }

  render() : JSX.Element {
    return (
      <div>
        <h1>{this.props.title}</h1>
      </div>
    );
  }
}