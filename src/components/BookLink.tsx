import * as React from "react";

export default class BookLink extends React.Component<BookLinkProps, any> {
  render(): JSX.Element {
    return (
      <a className={this.props.className} href={"?book=" + this.props.book.id} onClick={this.handleClick.bind(this)}>
        {this.props.children || this.props.text}
      </a>
    );
  }

  handleClick(event) {
    // if any of these keys are pressed, the url is opened by the browser as it pleases
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return true;
    } else {
      // if not, the url is passed to showBookDetails
      this.props.showBookDetails(this.props.book);
      event.preventDefault();
      return false;
    }
  }
}