import * as React from "react";

export interface SkipNavigationLinkProps
  extends React.HTMLProps<SkipNavigationLink> {
  target: string;
  label?: string;
}

/** Link to skip to main content for a11y. */
export default class SkipNavigationLink extends React.Component<
  SkipNavigationLinkProps,
  {}
> {
  render(): JSX.Element {
    let tabIndex = -1;
    let label = "Skip " + (this.props.label || "navigation");
    return (
      <div className="skip-navigation" tabIndex={tabIndex}>
        <a href={this.props.target}>{label}</a>
      </div>
    );
  }
}
