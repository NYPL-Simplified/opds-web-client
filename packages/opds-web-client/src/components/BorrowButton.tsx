import * as React from "react";

export interface BorrowButtonProps extends React.HTMLProps<{}> {
  borrow: () => Promise<any>;
}

export default class BorrowButton extends React.Component<
  BorrowButtonProps,
  {}
> {
  render() {
    const {
      ref,
      borrow,
      children,
      // pull this off so we can safely spread the rest
      type,
      ...props
    } = this.props;

    return (
      <button
        className="btn btn-default"
        {...props}
        onClick={this.props.borrow}
      >
        {this.props.children}
      </button>
    );
  }
}
