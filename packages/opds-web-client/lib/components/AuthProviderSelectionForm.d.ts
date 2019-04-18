import * as React from "react";
import { AuthCallback, AuthCredentials, AuthProvider, AuthMethod } from "../interfaces";
export interface AuthFormProps<T extends AuthMethod> {
    hide?: () => void;
    saveCredentials?: (credentials: AuthCredentials) => void;
    callback?: AuthCallback;
    cancel?: () => void;
    error?: string;
    provider?: AuthProvider<T>;
}
export interface AuthButtonProps<T extends AuthMethod> {
    provider?: AuthProvider<T>;
    onClick?: () => void;
}
export interface AuthProviderSelectionFormProps {
    hide: () => void;
    saveCredentials: (credentials: AuthCredentials) => void;
    callback?: AuthCallback;
    cancel: () => void;
    title?: string;
    error?: string;
    attemptedProvider?: string;
    providers?: AuthProvider<AuthMethod>[];
}
export interface AuthProviderSelectionFormState {
    selectedProvider: AuthProvider<AuthMethod>;
}
/** Shows buttons for each available authentication provider, or the form for
    the selected authentication provider. */
export default class AuthProviderSelectionForm extends React.Component<AuthProviderSelectionFormProps, AuthProviderSelectionFormState> {
    constructor(props: any);
    render(): JSX.Element;
    componentWillMount(): void;
    selectProvider(provider: any): void;
}
