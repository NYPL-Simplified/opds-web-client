import * as React from "react";
import { visuallyHiddenStyle } from "./styles";

export default class SkipNavigationLink extends React.Component<any, any> {
  render(): JSX.Element {
    return(
      <div style={visuallyHiddenStyle}>
        <a className="skipNavigation" href="#main">Skip Navigation</a>
      </div>
    );
  }
};
