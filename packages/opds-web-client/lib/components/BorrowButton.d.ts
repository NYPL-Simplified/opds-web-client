import * as React from "react";
export interface BorrowButtonProps extends React.HTMLProps<{}> {
    borrow: () => Promise<any>;
}
export default class BorrowButton extends React.Component<BorrowButtonProps, {}> {
    render(): JSX.Element;
}
