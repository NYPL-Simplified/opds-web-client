import * as React from "react";
import { BasicAuthMethod } from "../interfaces";
import { AuthButtonProps } from "./AuthProviderSelectionForm";

/** Button for selecting a basic authentication provider. */
export default class BasicAuthButton extends React.Component<
  AuthButtonProps<BasicAuthMethod>,
  {}
> {
  render() {
    let label = this.props.provider?.method.description
      ? "Log in with " + this.props.provider.method.description
      : "Log in";

    return (
      <input
        type="submit"
        className="btn btn-default"
        value={label}
        onClick={this.props.onClick}
      />
    );
  }
}
