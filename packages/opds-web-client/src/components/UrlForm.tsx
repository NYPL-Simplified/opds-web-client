import * as React from "react";
import { NavigateContext } from "../interfaces";

export interface UrlFormProps {
  collectionUrl?: string;
}

export default class UrlForm extends React.Component<UrlFormProps, void> {
  context: NavigateContext;

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static contextTypes: React.ValidationMap<NavigateContext> = {
    router: React.PropTypes.object.isRequired,
    pathFor: React.PropTypes.func.isRequired
  };

  render(): JSX.Element {
    let placeholder = "e.g. http://feedbooks.github.io/opds-test-catalog/catalog/root.xml";

    return (
      <div className="url-form">
        <h2>View OPDS Feed</h2>
        <form onSubmit={this.onSubmit} className="form-inline">
          <input
            ref="input"
            name="collection"
            type="text"
            className="form-control input-lg"
            defaultValue={this.props.collectionUrl}
            placeholder={placeholder} />
          &nbsp;
          <button type="submit" className="btn btn-lg btn-default">Go</button>
        </form>
      </div>
    );
  }

  onSubmit(event) {
    let url = this.refs["input"]["value"];
    this.context.router.push(this.context.pathFor(url, null));
    event.preventDefault();
  }
}