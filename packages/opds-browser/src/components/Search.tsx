import * as React from "react";

export default class Search extends React.Component<SearchProps, any> {
  render(): JSX.Element {
    return (
      <div className="search">
        { this.props.searchData && (
          <form onSubmit={this.onSubmit.bind(this)} className={this.props.className || "form-inline"}>
            <input
              className="form-control"
              ref="input"
              type="text"
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
    if (props.url) {
      props.fetchSearchDescription(props.url);
    }
  }

  onSubmit(event) {
    let searchTerms = encodeURIComponent(this.refs["input"]["value"]);
    let url = this.props.searchData.template(searchTerms);
    this.props.setCollectionAndBook(url, null);
    event.preventDefault();
  }
}