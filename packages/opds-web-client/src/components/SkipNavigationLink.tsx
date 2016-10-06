import * as React from "react";

export default class SkipNavigationLink extends React.Component<any, any> {
  render(): JSX.Element {
    return(
      <div className="skip-navigation">
        <a href={this.props.target} tabindex="-1">Skip Navigation</a>
      </div>
    );
  }
};
