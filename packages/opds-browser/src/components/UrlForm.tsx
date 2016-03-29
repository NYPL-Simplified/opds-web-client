import * as React from "react";

export default class UrlForm extends React.Component<UrlFormProps, any> {
  render(): JSX.Element {
    let placeholder = "e.g. http://feedbooks.github.io/opds-test-catalog/catalog/root.xml";

    return (
      <div id="urlForm" style={{ width: "800px", margin: "200px auto" }}>
        <h2>Browse OPDS Feed</h2>
        <form onSubmit={this.onSubmit.bind(this)} className="form-inline">
          <input
            ref="input"
            name="collection"
            type="text"
            className="form-control input-lg"
            style={{ width: "650px" }}
            defaultValue={this.props.url}
            placeholder={placeholder} />
          &nbsp;
          <button type="submit" className="btn btn-lg btn-default">Browse</button>
        </form>
      </div>
    );
  }

  onSubmit(event) {
    let url = this.refs["input"]["value"];
    this.props.navigate(url, null);
    event.preventDefault();
  }
}