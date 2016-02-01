import * as React from 'react';

export default class Book extends React.Component<any, any> {  
  constructor(props: any) {
    super(props);
  }

  render() : JSX.Element {
    return (
      <div className="opdsEntry" style={{ float: "left", textAlign: "center", marginRight: "10px" }}>
        <img src={this.props.imageUrl} style={{ height: "200px" }} />
        <div className="opdsEntryTitle">{this.props.title}</div>
      </div>
    );
  }
}