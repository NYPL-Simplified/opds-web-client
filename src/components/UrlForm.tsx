import * as React from 'react';

export default class UrlForm extends React.Component<any, any> {
  render() : JSX.Element {    
    return (
      <div id="urlForm" style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Remote Data URL:</h1>
        <input ref="input" type="text" style={{ width: "600px", fontSize: "1.2em", padding: "0.5em" }} />&nbsp;
        <button style={{ fontSize: "1.2em", padding: "0.5em" }} onClick={() => this.onClick()} >Load</button>
      </div>
    );
  }
  
  onClick() {
    let url = this.refs["input"]["value"];
    this.props.fetchUrl(url);
  }
}