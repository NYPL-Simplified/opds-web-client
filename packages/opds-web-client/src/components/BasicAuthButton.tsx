import * as React from "react";
import { AuthProvider, BasicAuthMethod } from "../interfaces";
import { AuthButtonProps } from "./AuthProviderSelectionForm";

export default class BasicAuthButton extends React.Component<AuthButtonProps<BasicAuthMethod>, void> {
  render() {
    let label = "Log in with " + this.props.provider.name;

    return (
      <input type="submit" className="btn btn-default" value={label} />
    );
  }
}