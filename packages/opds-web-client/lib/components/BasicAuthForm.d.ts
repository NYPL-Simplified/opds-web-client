import * as React from "react";
import { BasicAuthMethod } from "../interfaces";
import { AuthFormProps } from "./AuthProviderSelectionForm";
export interface BasicAuthFormProps extends AuthFormProps<BasicAuthMethod> {
}
export interface BasicAuthFormState {
    error: string;
}
/** Form for logging in with basic auth. */
export default class BasicAuthForm extends React.Component<BasicAuthFormProps, BasicAuthFormState> {
    constructor(props: any);
    render(): JSX.Element;
    componentWillReceiveProps(nextProps: any): void;
    loginLabel(): string;
    passwordLabel(): string;
    validate(): boolean;
    submit(event: any): void;
    generateCredentials(login: any, password: any): string;
}
