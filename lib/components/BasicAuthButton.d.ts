import * as React from "react";
import { BasicAuthMethod } from "../interfaces";
import { AuthButtonProps } from "./AuthProviderSelectionForm";
/** Button for selecting a basic authentication provider. */
export default class BasicAuthButton extends React.Component<AuthButtonProps<BasicAuthMethod>, {}> {
    render(): JSX.Element;
}
