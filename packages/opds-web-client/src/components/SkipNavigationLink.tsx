import * as React from "react";
import "../stylesheets/visually_hidden.scss";

export default class SkipNavigationLink extends React.Component<any, any> {
  render(): JSX.Element {
    return(
      <div className="visually-hidden">
        <a className="skipNavigation" href="#main">Skip Navigation</a>
      </div>
    );
  }
};
