import * as React from "react";

export default class CollectionLink extends React.Component<any, any> {
  constructor(props: CollectionLinkProps) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <a className={this.props.className} href={"?url=" + this.props.url} onClick={this.handleClick.bind(this)}>
        {this.props.text || this.props.children}
      </a>
    );
  }

  handleClick(event) {
    // if any of these keys are pressed, the url is opened by the browser as it pleases
    if (event.metaKey || event.altKey || event.ctrlKey) {
      return true;
    } else {
      // if not, the provided url is passed to the provided onClick, if url and onClick exist
      this.props.fetchCollection(this.props.url);
      event.preventDefault();
      return false;
    }
  }
}