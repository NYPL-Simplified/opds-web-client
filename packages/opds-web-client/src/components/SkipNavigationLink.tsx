import * as React from "react";

export default class SkipNavigationLink extends React.Component<any, any> {
  render(): JSX.Element {
    let tabIndex = -1;
    return(
      <div className="skip-navigation" tabIndex={tabIndex}>
        <a href={this.props.target}>Skip Navigation</a>
      </div>
    );
  }
};
