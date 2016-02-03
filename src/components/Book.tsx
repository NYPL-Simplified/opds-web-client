import * as React from 'react';

export default class Book extends React.Component<any, any> {  
  constructor(props: any) {
    super(props);
  }

  render() : JSX.Element {
    return (
      <div className="opdsEntry" style={{ float: "left", textAlign: "center", marginRight: "10px", width: "350px", height: "200px", marginBottom: "10px", overflow: "hidden" }}>
        <img src={this.props.imageUrl} style={{ width: "150px", height: "200px", float: "left" }} />
        <div className="opdsEntryInfo" style={{ float: "left", width: "160px", textAlign: "left", marginTop: "15px", marginLeft: "5px"  }}>
          <h3 className="opdsEntryTitle">{this.props.title}</h3>
          <h4 className="opdsEntryAuthors">{this.props.authors.join(", ")}</h4>
        </div>
      </div>
    );
  }
}