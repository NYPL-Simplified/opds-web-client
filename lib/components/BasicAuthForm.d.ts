import * as React from "react";
import { BasicAuthMethod } from "../interfaces";
import { AuthFormProps } from "./AuthProviderSelectionForm";
export interface BasicAuthFormProps extends AuthFormProps<BasicAuthMethod> {
}
export interface BasicAuthFormState {
    error?: string | null;
}
/** Form for logging in with basic auth. */
export default class BasicAuthForm extends React.Component<BasicAuthFormProps, BasicAuthFormState> {
    private loginRef;
    private passwordRef;
    constructor(props: any);
    render(): JSX.Element;
    componentWillReceiveProps(nextProps: any): void;
    loginLabel(): string;
    passwordLabel(): string;
    /**
     * validate()
     * Not all libraries require a password to log in so that value is not checked.
     */
    validate(login: string | null | undefined): login is string;
    submit(event: any): void;
}
