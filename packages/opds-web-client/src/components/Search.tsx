import * as React from "react";
import * as PropTypes from "prop-types";
import {
  SearchData,
  NavigateContext,
  Router as RouterType
} from "../interfaces";

export interface SearchProps extends SearchData, React.HTMLProps<Search> {
  fetchSearchDescription?: (url: string) => void;
  allLanguageSearch?: boolean;
}

/** Search box. */
export default class Search extends React.Component<SearchProps, {}> {
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
    return (
      <div className="search" role="search">
        {this.props.searchData && (
          <form
            onSubmit={this.onSubmit}
            className={this.props.className || "form-inline"}
          >
            <input
              className="form-control"
              ref="input"
              aria-label="Enter search keyword or keywords"
              type="text"
              name="search"
              title={this.props.searchData.shortName}
              placeholder={this.props.searchData.shortName}
            />
            &nbsp;
            <button className="btn btn btn-default" type="submit">
              Search
            </button>
          </form>
        )}
      </div>
    );
  }

  componentWillMount() {
    if (this.props.url) {
      this.props.fetchSearchDescription?.(this.props.url);
    }
  }

  componentWillUpdate(props) {
    if (props.url && props.url !== this.props.url) {
      props.fetchSearchDescription(props.url);
    }
  }

  onSubmit(event) {
    let searchTerms = encodeURIComponent(this.refs["input"]["value"]);
    let url = this.props.searchData?.template(searchTerms);
    if (this.props.allLanguageSearch) {
      url += "&language=all";
    }
    this.context.router?.push(this.context.pathFor(url, null));
    event.preventDefault();
  }
}
