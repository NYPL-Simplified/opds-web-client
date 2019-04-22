import * as React from "react";

export interface BorrowButtonProps extends React.HTMLProps<{}> {
  borrow: () => Promise<any>;
}

export default class BorrowButton extends React.Component<BorrowButtonProps, {}> {
  render() {
    // const { borrow, children, ...rest } = this.props;
    let props = Object.assign<HTMLButtonElement, any>({} as HTMLButtonElement, this.props);

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
