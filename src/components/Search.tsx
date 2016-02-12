import * as React from "react";

export default class Search extends React.Component<SearchProps, any> {
  render(): JSX.Element {
    return (
      <div className="search" style={{ float: "right", marginRight: "20px" }}>
        { this.props.data && (
          <form onSubmit={this.onSubmit.bind(this)}>
            <input ref="input" type="text" placeholder={this.props.data.shortName}/>
            <button type="submit">Search</button>
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
    let url = this.props.data.template(searchTerms);
    this.props.fetchCollection(url);
    event.preventDefault();
  }
}