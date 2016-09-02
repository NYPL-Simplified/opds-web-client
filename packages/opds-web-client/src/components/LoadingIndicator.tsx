import * as React from "react";
import "../stylesheets/loading_indicator.scss";

export default class LoadingIndicator extends React.Component<any, any> {
  render(): JSX.Element {
    return (
      <h1 className="loading">Loading</h1>
    );
  }
}