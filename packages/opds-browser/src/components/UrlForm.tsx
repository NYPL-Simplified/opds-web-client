import * as React from "react";

export default class UrlForm extends React.Component<UrlFormProps, any> {
  render(): JSX.Element {
    let placeholder = "e.g. http://feedbooks.github.io/opds-test-catalog/catalog/root.xml"

    return (
      <div id="urlForm" style={{ width: "800px", margin: "200px auto" }}>
        <h2>Browse OPDS Feed</h2>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input
            ref="input"
            name="collection"
            type="text"
            style={{ width: "650px", fontSize: "1.2em", padding: "0.5em" }}
            defaultValue={this.props.url}
            placeholder={placeholder} />
          &nbsp;
          <button type="submit" style={{ fontSize: "1.2em", padding: "0.5em" }}>Browse</button>
        </form>
      </div>
    );
  }

  onSubmit(event) {
    let url = this.refs["input"]["value"];
    this.props.setCollectionAndBook(url, null);
    event.preventDefault();
  }
}