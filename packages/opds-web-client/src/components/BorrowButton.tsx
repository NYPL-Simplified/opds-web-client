import * as React from "react";

export interface BorrowButtonProps extends React.HTMLProps<{}> {
  borrow: () => Promise<any>;
}

export default class BorrowButton extends React.Component<BorrowButtonProps, {}> {
  render() {
    let props = JSON.parse(JSON.stringify(this.props));
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
