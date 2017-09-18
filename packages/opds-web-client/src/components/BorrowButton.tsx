import * as React from "react";

export interface BorrowButtonProps extends React.HTMLProps<any> {
  borrow: () => Promise<any>;
}

export default class BorrowButton extends React.Component<BorrowButtonProps, void> {
  render() {
    let props = Object.assign({}, this.props);
    delete props["book"];
    delete props["borrow"];
    delete props["key"];

    return (
      <button
        className="btn btn-default"
        {...props}
        onClick={this.props.borrow}>
        {this.props.children}
      </button>
    );
  }
}
