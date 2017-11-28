import * as React from "react";
import { PropTypes } from "prop-types";
import { NavigateContext } from "../interfaces";

export interface UrlFormProps {
  collectionUrl?: string;
}

/** Page for entering the URL of an OPDS feed that's shown when no feed
    is specified in the URL. Submitting the form adds the feed to the URL. */
export default class UrlForm extends React.Component<UrlFormProps, void> {
  context: NavigateContext;

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static contextTypes: React.ValidationMap<NavigateContext> = {
    router: PropTypes.object.isRequired,
    pathFor: PropTypes.func.isRequired
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