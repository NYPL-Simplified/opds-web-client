import * as React from "react";
import {
  AuthCallback,
  AuthCredentials,
  AuthProvider,
  AuthMethod
} from "../interfaces";

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
export default class AuthProviderSelectionForm extends React.Component<
  AuthProviderSelectionFormProps,
  AuthProviderSelectionFormState
> {
  constructor(props) {
    super(props);
    let selectedProvider: AuthProvider<AuthMethod> | null = null;
    if (this.props.error && this.props.attemptedProvider) {
      for (let provider of this.props.providers ?? []) {
        if (this.props.attemptedProvider === provider.id) {
          selectedProvider = provider;
          break;
        }
      }
    }
    this.state = { selectedProvider };
    this.selectProvider = this.selectProvider.bind(this);
  }

  render() {
    let AuthForm =
      this.state.selectedProvider &&
      this.state.selectedProvider.plugin.formComponent;

    return (
      <div
        className="auth-form"
        role="dialog"
        aria-labelledby="auth-form-title"
      >
        <div>
          <h3 id="auth-form-title">
            {this.props.title ? this.props.title + " " : ""}Login
          </h3>
          {this.state.selectedProvider && AuthForm && (
            <AuthForm
              hide={this.props.hide}
              saveCredentials={this.props.saveCredentials}
              callback={this.props.callback}
              cancel={this.props.cancel}
              error={this.props.error}
              provider={this.state.selectedProvider}
            />
          )}
          {!this.state.selectedProvider &&
            this.props.providers &&
            this.props.providers.length > 0 && (
              <div>
                <ul className="subtle-list" aria-label="authentication options">
                  {this.props.providers.map(provider => (
                    <li key={provider.id}>
                      <provider.plugin.buttonComponent
                        provider={provider}
                        onClick={() => this.selectProvider(provider)}
                      />
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-default"
                  onClick={this.props.cancel ?? undefined}
                >
                  Cancel
                </button>
              </div>
            )}
        </div>
      </div>
    );
  }

  componentWillMount() {
    if (this.props.providers && this.props.providers.length === 1) {
      this.setState({ selectedProvider: this.props.providers[0] });
    }
  }

  selectProvider(provider) {
    this.setState({ selectedProvider: provider });
  }
}
