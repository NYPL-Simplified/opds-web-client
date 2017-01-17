import * as React from "react";

export default class LoadingIndicator extends React.Component<any, any> {
  render(): JSX.Element {
    return (
      <div className="loading">
        <h1>Loading</h1>
      </div>
    );
  }
}