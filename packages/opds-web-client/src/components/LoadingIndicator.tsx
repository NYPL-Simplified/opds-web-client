import * as React from "react";

export default class LoadingIndicator extends React.Component<{}, {}> {
  render(): JSX.Element {
    return (
      <div className="loading" role="dialog" aria-labelledby="loading">
        <h1 id="loading">Loading</h1>
      </div>
    );
  }
}
