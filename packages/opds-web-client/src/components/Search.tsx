import * as React from "react";
import { SearchData, NavigateContext } from "../interfaces";

export interface SearchProps extends SearchData, React.HTMLProps<Search> {
  fetchSearchDescription?: (url: string) => void;
}

export default class Search extends React.Component<SearchProps, any> {
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
    return (
      <div className="search">
        { this.props.searchData && (
          <form onSubmit={this.onSubmit} className={this.props.className || "form-inline"}>
            <input
              className="form-control"
              ref="input"
              type="text"
              name="search"
              title={this.props.searchData.shortName}
              placeholder={this.props.searchData.shortName} />&nbsp;
            <button
              className="btn btn btn-default"
              type="submit">Search</button>
          </form>
        )}
      </div>
    );
  }

  componentWillMount() {
    if (this.props.url) {
      this.props.fetchSearchDescription(this.props.url);
    }
  }

  componentWillUpdate(props) {
    if (props.url && props.url !== this.props.url) {
      props.fetchSearchDescription(props.url);
    }
  }

  onSubmit(event) {
    let searchTerms = encodeURIComponent(this.refs["input"]["value"]);
    let url = this.props.searchData.template(searchTerms);
    this.context.router.push(this.context.pathFor(url, null));
    event.preventDefault();
  }
}