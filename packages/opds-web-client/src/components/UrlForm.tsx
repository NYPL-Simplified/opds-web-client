import * as React from "react";
import * as PropTypes from "prop-types";
import { NavigateContext, Router as RouterType } from "../interfaces";

export interface UrlFormProps {
  collectionUrl?: string;
}

/** Page for entering the URL of an OPDS feed that's shown when no feed
    is specified in the URL. Submitting the form adds the feed to the URL. */
export default class UrlForm extends React.Component<UrlFormProps, {}> {
  private inputRef = React.createRef<HTMLInputElement>();
  context: NavigateContext;

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static contextTypes: React.ValidationMap<NavigateContext> = {
    router: PropTypes.object.isRequired as React.Validator<RouterType>,
    pathFor: PropTypes.func.isRequired
  };

  render(): JSX.Element {
    let placeholder =
      "e.g. http://feedbooks.github.io/opds-test-catalog/catalog/root.xml";

    return (
      <div className="url-form">
        <h2>View OPDS Feed</h2>
        <form onSubmit={this.onSubmit} className="form-inline">
          <label htmlFor="opds-input">Enter OPDS feed URL</label>
          <input
            id="opds-input"
            ref={this.inputRef}
            name="collection"
            type="text"
            className="form-control input-lg"
            defaultValue={this.props.collectionUrl}
            placeholder={placeholder}
          />
          <button type="submit" className="btn btn-lg btn-default">
            Go
          </button>
        </form>
      </div>
    );
  }

  onSubmit(event) {
    event.preventDefault();

    const url = this.inputRef.current && this.inputRef.current.value;
    if (url !== "") {
      this.context.router?.push(this.context.pathFor(url, null));
    }
  }
}
