import * as React from "react";
import { AuthCallback, AuthCredentials, AuthProvider, AuthMethod } from "../interfaces";
export interface AuthFormProps<T extends AuthMethod> {
    hide?: () => void;
    saveCredentials?: (credentials: AuthCredentials) => void;
    callback?: AuthCallback | null;
    cancel?: (() => void) | null;
    error?: string | null;
    provider: AuthProvider<T>;
}
export interface AuthButtonProps<T extends AuthMethod> {
    provider?: AuthProvider<T>;
    onClick?: () => void;
}
export interface AuthProviderSelectionFormProps {
    hide?: () => void;
    saveCredentials?: (credentials: AuthCredentials) => void;
    callback?: AuthCallback | null;
    cancel: (() => void) | null;
    title?: string | null;
    error?: string | null;
    attemptedProvider?: string | null;
    providers?: AuthProvider<AuthMethod>[] | null;
}
export interface AuthProviderSelectionFormState {
    selectedProvider: AuthProvider<AuthMethod> | null;
}
/** Shows buttons for each available authentication provider, or the form for
    the selected authentication provider. */
export default class AuthProviderSelectionForm extends React.Component<AuthProviderSelectionFormProps, AuthProviderSelectionFormState> {
    constructor(props: any);
    render(): JSX.Element;
    componentWillMount(): void;
    selectProvider(provider: any): void;
}
