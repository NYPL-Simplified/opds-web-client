import * as React from "react";

export default class UrlForm extends React.Component<UrlFormProps, any> {
  render(): JSX.Element {
    return (
      <div id="urlForm" style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Remote Data URL:</h1>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input
            ref="input"
            name="collection"
            type="text"
            style={{ width: "600px", fontSize: "1.2em", padding: "0.5em" }}
            defaultValue={this.props.url} />
          &nbsp;
          <button type="submit" style={{ fontSize: "1.2em", padding: "0.5em" }}>Load</button>
        </form>
      </div>
    );
  }

  onSubmit(event) {
    let url = this.refs["input"]["value"];
    this.props.setCollection(url);
    event.preventDefault();
  }
}